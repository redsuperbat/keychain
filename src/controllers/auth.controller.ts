import { RequestHandler } from 'express'
import { Database } from '../database'
import { LoginDTO } from '../dto/request/login.dto'
import { RefreshTokenDTO } from '../dto/request/refresh-token.dto'
import { RegisterDTO } from '../dto/request/register.dto'
import { AuthDTO } from '../dto/response/auth.dto'
import { UserDTO } from '../dto/response/user.dto'
import { User } from '../entity/User'
import { BadRequest } from '../error/bad-request'
import { NotFound } from '../error/not-found'
import { Unauthorized } from '../error/unauthorized'
import { JWT } from '../security/jwt'
import { PasswordHash } from '../security/password-hash'
import { RegEx } from '../static/regex.static'

export class AuthController {
  public static refreshToken: RequestHandler = async ({ body }: { body: RefreshTokenDTO }, res, next) => {
    // check if the jwt token is valid & has not expired
    if (!JWT.isTokenValid(body.token)) throw new Unauthorized('JWT is not valid')

    const jwtId = JWT.getJwtPayloadValueByKey(body.token, 'jti')

    const user = await Database.userRepository.findOne(JWT.getJwtPayloadValueByKey(body.token, 'id'))

    // check if the user exists
    if (!user) throw new NotFound('User does not exist')

    // fetch refresh token from db
    const refreshToken = await Database.refreshTokenRepository.findOne(body.refreshToken)

    // check if the refresh token exists and is linked to that jwt token‚
    if (!JWT.isRefreshTokenLinkedToToken(refreshToken, jwtId))
      throw new Unauthorized('Token does not match with Refresh Token')

    // check if the refresh token has expired
    if (JWT.isRefreshTokenExpired(refreshToken)) throw new Unauthorized('Refresh Token has expired')

    // check if the refresh token was used or invalidated
    if (JWT.isRefreshTokenUsedOrInvalidated(refreshToken))
      throw new Unauthorized('Refresh Token has been used or invalidated')

    refreshToken.used = true

    await Database.refreshTokenRepository.save(refreshToken)

    // generate a fresh pair of token and refresh token
    const tokenResults = await JWT.generateTokenAndRefreshToken(user)

    // generate an authentication response
    const authenticationDTO = new AuthDTO()
    authenticationDTO.user = UserDTO.fromJson(user)
    authenticationDTO.token = tokenResults.token
    authenticationDTO.refreshToken = tokenResults.refreshToken

    res.json(authenticationDTO)
  }

  public static register: RequestHandler = async ({ body: { email, password } }: { body: RegisterDTO }, res, next) => {
    // Check if valid info was provided
    if (!email || !password) throw new BadRequest('Invalid information provided')

    // Check if user exists
    if (await Database.userRepository.findOne({ email })) throw new BadRequest('Email already exists')

    // Check if email is valid
    if (!RegEx.email(email)) throw new BadRequest('Invalid email format')

    // Create user and save in DB
    const user = new User()
    user.email = email
    user.password = await PasswordHash.hashPassword(password)
    const savedUser = await Database.userRepository.save(user)

    const { token, refreshToken } = await JWT.generateTokenAndRefreshToken(user)

    // create DTO
    const authDTO = new AuthDTO()
    authDTO.user = User.fromJson(savedUser)
    authDTO.refreshToken = refreshToken
    authDTO.token = token

    res.status(201).json(authDTO)
  }

  public static login: RequestHandler = async (req, res, next) => {
    const loginDTO: LoginDTO = req.body
    const user = await Database.userRepository.findOne({
      email: loginDTO.email,
    })

    // If no user was found throw error
    if (!user) throw new BadRequest('User does not exist')

    // If password does not match user password throw error
    if (!PasswordHash.isPasswordValid(loginDTO.password, user.password)) throw new Unauthorized('Invalid credentials')

    const { token, refreshToken } = await JWT.generateTokenAndRefreshToken(user)

    // Create DTO
    const authDTO = new AuthDTO()
    authDTO.user = User.fromJson(user)
    authDTO.refreshToken = refreshToken
    authDTO.token = token

    return res.json(authDTO)
  }

  public async logout(token: string) {
    // validate the retrieved jwt token
    if (!JWT.isTokenValid(token, true)) throw new Unauthorized('Unauthorized')

    // retrieve the connected refresh token
    const refreshToken = await JWT.getRefreshTokenByJwtToken(token)

    // update the refresh token and set invalidated to true
    await JWT.invalidateRefreshToken(refreshToken)
  }
}

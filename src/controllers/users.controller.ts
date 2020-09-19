import { RequestHandler } from 'express'
import { Database } from '../database'
import { PasswordHash } from '../security/password-hash'
import { User } from '../entity/User'
import { RegisterDTO } from '../dto/request/register.dto'
import { JWT } from '../security/jwt'
import { AuthDTO } from '../dto/response/auth.dto'
import { BadRequest } from '../error/bad-request'
import { Unauthorized } from '../error/unauthorized'
import { RegEx } from '../static/regex.static'
import { LoginDTO } from '../dto/request/login.dto'
import { UserDTO } from '../dto/response/user.dto'
import { nextTick } from 'process'

export class UsersController {
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

  public static delete: RequestHandler = async ({ params: { id } }, res) => {
    const user = await Database.userRepository.findOne(id, {
      relations: ['refreshTokens'],
    })

    // Throw error if user is not found
    if (!user) throw new BadRequest('Entity not found')

    await Database.refreshTokenRepository.remove(user.refreshTokens)
    await Database.userRepository.remove(user)

    // Create userDTO
    const userDTO = new UserDTO()
    userDTO.email = user.email
    userDTO.id = user.id

    res.json(userDTO)
  }

  public static get_all: RequestHandler = async (req, res) => {
    const users = await Database.userRepository.find({
      relations: ['refreshTokens'],
    })
    res.json(users)
  }

  //  public delete_all: RequestHandler = (req, res) => {
  //    Database.userRepository.remove
  //   //  User.deleteMany({})
  //      .exec()
  //      .then((result) => res.json(result))
  //      .catch((error) => res.status(500).json({ error }));
  //  };

  // public edit: RequestHandler = (req: IUserDataRequest, res) => {
  //   const id = req.userData.userId;
  //   User.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: req.body })
  //     .exec()
  //     .then((result) => res.json(result))
  //     .catch((error) => res.status(500).json({ error }));
  // };
}

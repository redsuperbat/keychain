import { type RequestHandler } from 'express';
import type { LoginDTO } from '../dto/request/login.dto.js';
import type { RefreshTokenDTO } from '../dto/request/refresh-token.dto.js';
import type { RegisterDTO } from '../dto/request/register.dto.js';
import { BadRequest } from '../error/bad-request.js';
import { NotFound } from '../error/not-found.js';
import { Unauthorized } from '../error/unauthorized.js';
import { JWT } from '../security/jwt.js';
import { PasswordHash } from '../security/password-hash.js';
import { RegEx } from '../static/regex.static.js';
import type { UserRepository, RefreshTokenRepository } from '../database.js';
import { RefreshToken } from '../entity/RefreshToken.js';

export class AuthController {
  #userRepository: UserRepository;
  #refreshTokenRepository: RefreshTokenRepository;
  #jwt: JWT;
  constructor(opts: {
    userRepository: UserRepository;
    refreshTokenRepository: RefreshTokenRepository;
    jwt: JWT;
  }) {
    this.#userRepository = opts.userRepository;
    this.#refreshTokenRepository = opts.refreshTokenRepository;
    this.#jwt = opts.jwt;
  }

  public refreshToken: RequestHandler = async (
    { body }: { body: RefreshTokenDTO },
    res
  ) => {
    // check if the jwt token is valid & has not expired
    if (!this.#jwt.isTokenValid(body.token))
      throw new Unauthorized('JWT is not valid');

    const jwtId = this.#jwt.getJwtPayloadValueByKey(body.token, 'jti');

    const user = await this.#userRepository.findById(
      this.#jwt.getJwtPayloadValueByKey(body.token, 'id')
    );

    // check if the user exists
    if (!user) throw new NotFound('User does not exist');

    // fetch refresh token from db
    const refreshToken = await this.#refreshTokenRepository.findById(
      body.refreshToken
    );
    if (!refreshToken) {
      throw new NotFound('no refresh token found');
    }

    // check if the refresh token exists and is linked to that jwt token‚
    if (!this.#jwt.isRefreshTokenLinkedToToken(refreshToken, jwtId))
      throw new Unauthorized('Token does not match with Refresh Token');

    // check if the refresh token has expired
    if (RefreshToken.expired(refreshToken))
      throw new Unauthorized('Refresh Token has expired');

    // check if the refresh token was used or invalidated
    if (RefreshToken.usedOrInvalidated(refreshToken))
      throw new Unauthorized('Refresh Token has been used or invalidated');

    refreshToken.used = true;

    await this.#refreshTokenRepository.createRefreshToken(refreshToken);

    // generate a fresh pair of token and refresh token
    const tokenResults = await this.#jwt.generateTokenAndRefreshToken(user);

    // generate an authentication response

    res.json({
      token: tokenResults.token,
      refreshToken: tokenResults.refreshToken,
      user,
    });
  };

  public register: RequestHandler = async (
    { body: { email, password } }: { body: RegisterDTO },
    res
  ) => {
    // Check if valid info was provided
    if (!email || !password)
      throw new BadRequest('Invalid information provided');

    // Check if user exists
    if (await this.#userRepository.findByEmail(email)) {
      throw new BadRequest('Email already exists');
    }

    // Check if email is valid
    if (!RegEx.email(email)) {
      throw new BadRequest('Invalid email format');
    }

    const hashedPassword = await PasswordHash.hashPassword(password);
    const user = await this.#userRepository.createUser({
      email,
      password: hashedPassword,
    });

    const { token, refreshToken } =
      await this.#jwt.generateTokenAndRefreshToken(user);

    res.status(201).json({ token, refreshToken, user });
  };

  public login: RequestHandler = async (req, res) => {
    const loginDTO: LoginDTO = req.body;
    const user = await this.#userRepository.findByEmail(loginDTO.email);

    // If no user was found throw error
    if (!user) throw new BadRequest('User does not exist');

    // If password does not match user password throw error
    if (!PasswordHash.isPasswordValid(loginDTO.password, user.password))
      throw new Unauthorized('Invalid credentials');

    const { token, refreshToken } =
      await this.#jwt.generateTokenAndRefreshToken(user);

    return res.json({ token, refreshToken, user });
  };

  public async logout(token: string) {
    // validate the retrieved jwt token
    if (!this.#jwt.isTokenValid(token, true)) {
      throw new Unauthorized('Unauthorized');
    }

    // retrieve the connected refresh token
    const refreshToken = await this.#jwt.getRefreshTokenByJwtToken(token);

    // update the refresh token and set invalidated to true
    await this.#jwt.invalidateRefreshToken(refreshToken);
  }
}

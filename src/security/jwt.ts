import jwt from 'jsonwebtoken';
import type { User } from '../entity/User.js';
import type { RefreshToken } from '../entity/RefreshToken.js';
import { RefreshTokenRepository } from '../database.js';
import { DateTime, Duration } from 'luxon';
import { randomUUID } from 'node:crypto';

export type jwtKey = 'jti' | 'id';

export class JWT {
  private static SECRET = process.env.SECRET || '123456';

  #refreshTokenRepository: RefreshTokenRepository;
  constructor(opts: { refreshTokenRepository: RefreshTokenRepository }) {
    this.#refreshTokenRepository = opts.refreshTokenRepository;
  }

  public getJwtPayloadValueByKey(token: string, key: jwtKey) {
    const decodedToken = jwt.decode(token);
    if (!decodedToken) throw new Error('invalid token');
    if (typeof decodedToken === 'string') throw new Error('invalid token');
    return decodedToken[key];
  }

  public isRefreshTokenLinkedToToken(
    refreshToken: RefreshToken,
    jwtId: string
  ) {
    if (!refreshToken || refreshToken.jwtId !== jwtId) return false;
    return true;
  }

  public async getRefreshTokenByJwtToken(token: string) {
    const jwtId = this.getJwtPayloadValueByKey(token, 'jti');
    const refreshToken = await this.#refreshTokenRepository.findById(jwtId);
    if (!refreshToken) throw new Error('Refresh token does not exist');
    return refreshToken;
  }

  public async generateTokenAndRefreshToken(user: User) {
    const payload = { email: user.email, id: user.id };

    const jwtId = randomUUID();
    const token = jwt.sign(payload, JWT.SECRET, {
      expiresIn: '1h',
      subject: user.id.toString(), // Should be user id
      jwtid: jwtId,
    });

    // create refresh token
    const refreshToken = await this.generateRefreshToken(user, jwtId);

    return { token, refreshToken };
  }

  private async generateRefreshToken(user: User, jwtId: string) {
    const token = await this.#refreshTokenRepository.createRefreshToken({
      creationDate: new Date(),
      expiryDate: DateTime.now()
        .plus(Duration.fromDurationLike({ days: 10 }))
        .toJSDate(),
      invalidated: false,
      jwtId,
      used: false,
      userId: user.id,
    });
    return token.id;
  }

  public isTokenValid(token: string, ignoreExpiration: boolean = false) {
    try {
      jwt.verify(token, JWT.SECRET, {
        ignoreExpiration: ignoreExpiration,
      });
      return true;
    } catch {
      return false;
    }
  }
  public static isTokenValid(token: string, ignoreExpiration: boolean = false) {
    try {
      jwt.verify(token, JWT.SECRET, {
        ignoreExpiration: ignoreExpiration,
      });
      return true;
    } catch {
      return false;
    }
  }

  public async invalidateRefreshToken(refreshToken: RefreshToken) {
    await this.#refreshTokenRepository.invalidate(refreshToken.id);
  }
}

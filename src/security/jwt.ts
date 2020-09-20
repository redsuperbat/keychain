import * as jwt from 'jsonwebtoken'
import { User } from '../entity/User'
import { v4 as uuidv4 } from 'uuid'
import { RefreshToken } from '../entity/RefreshToken'
import { addDays, isAfter } from 'date-fns'
import { Database } from '../database'

export type jwtKey = 'jti' | 'id'

export class JWT {
  private static JWT_SECRET = process.env.SECRET || '123456'

  public static getJwtPayloadValueByKey(token: string, key: jwtKey) {
    const decodedToken = jwt.decode(token)
    return decodedToken[key]
  }

  public static isRefreshTokenLinkedToToken(refreshToken: RefreshToken, jwtId: string) {
    if (!refreshToken || refreshToken.jwtId !== jwtId) return false
    return true
  }

  public static async getRefreshTokenByJwtToken(token: string) {
    const jwtId = this.getJwtPayloadValueByKey(token, 'jti')
    const refreshToken = await Database.refreshTokenRepository.findOne({ jwtId })
    if (!refreshToken) throw new Error('Refreshtoken does not exist')
    return refreshToken
  }

  public static isRefreshTokenExpired = (refreshToken: RefreshToken) => !isAfter(refreshToken.expiryDate, new Date())

  public static isRefreshTokenUsedOrInvalidated = (refreshToken: RefreshToken) =>
    refreshToken.used || refreshToken.invalidated

  public static async generateTokenAndRefreshToken(user: User) {
    const payload = { email: user.email, id: user.id }

    const jwtId = uuidv4()
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '1h',
      subject: user.id.toString(), // Should be user id
      jwtid: jwtId,
    })

    // create refresh token
    const refreshToken = await this.generateRefreshToken(user, jwtId)

    return { token, refreshToken }
  }

  private static async generateRefreshToken(user: User, jwtId: string) {
    const refreshToken = new RefreshToken()
    refreshToken.user = user
    refreshToken.jwtId = jwtId
    refreshToken.expiryDate = addDays(new Date(), 10)
    // store refresh token
    const savedRefreshToken = await Database.refreshTokenRepository.save(refreshToken)
    return savedRefreshToken.id
  }

  public static isTokenValid(token: string, ignoreExpiration: boolean = false) {
    try {
      jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration: ignoreExpiration,
      })

      return true
    } catch (error) {
      return false
    }
  }

  public static async invalidateRefreshToken(refreshToken: RefreshToken) {
    refreshToken.invalidated = true
    await Database.refreshTokenRepository.save(refreshToken)
  }
}

import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { v4 as uuidv4 } from "uuid";
import { RefreshToken } from "../entity/RefreshToken";
import { addDays } from "date-fns";
import { Database } from "../database";

export class JWT {
  private static JWT_SECRET = process.env.SECRET || "123456";

  public static async generateTokenAndRefreshToken(user: User) {
    const payload = { email: user.email, id: user.id };

    const jwtId = uuidv4();
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: "1h",
      subject: user.id.toString(), // Should be user id
      jwtid: jwtId,
    });

    // create refresh token
    const refreshToken = await this.generateRefreshToken(user, jwtId);

    return { token, refreshToken };
  }

  private static async generateRefreshToken(user: User, jwtId: string) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    refreshToken.expiryDate = addDays(new Date(), 10);
    // store refresh token
    const savedRefreshToken = await Database.refreshTokenRepository.save(
      refreshToken
    );
    return savedRefreshToken.id;
  }

  public static isTokenValid(token: string, ignoreExpiration: boolean = false) {
    try {
      jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration: ignoreExpiration,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  public static async invalidateRefreshToken(refreshToken: RefreshToken) {
    refreshToken.invalidated = true;

    await Database.refreshTokenRepository.save(refreshToken);
  }
}

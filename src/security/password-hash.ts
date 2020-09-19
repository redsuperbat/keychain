import * as bcrypt from "bcrypt";

export class PasswordHash {
  public static async hashPassword(plain: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plain, salt);
    return hashedPassword;
  }

  public static isPasswordValid(plainPassword: string, hashedPassword: string) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

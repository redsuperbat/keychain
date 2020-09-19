import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { RefreshToken } from "./RefreshToken";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  public static fromJson(json: any) {
    const user = new User();
    user.email = json.email;
    user.id = json.id;
    user.password = json.password;
    user.refreshTokens = json.refreshTokens;
    return user;
  }
}

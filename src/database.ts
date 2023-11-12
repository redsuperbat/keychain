import type { RefreshToken } from './entity/RefreshToken.js';
import type { User } from './entity/User.js';
import type { Sql } from 'postgres';

export class RefreshTokenRepository {
  #db: Sql;
  constructor(opts: { db: Sql }) {
    this.#db = opts.db;
  }
  async createRefreshToken(
    token: Omit<RefreshToken, 'id' | 'updateDate'>
  ): Promise<RefreshToken> {
    return {} as RefreshToken;
  }
  async findById(id: string): Promise<RefreshToken | undefined> {
    return;
  }
  async invalidate(id: string): Promise<boolean> {
    return false;
  }
  async delete(id: string): Promise<boolean> {
    return false;
  }
  async getByUserId(userId: string): Promise<RefreshToken[]> {
    return [];
  }
  async deleteByUserId(userId: string): Promise<boolean> {
    return true;
  }
}
export class UserRepository {
  #db: Sql;
  constructor(opts: { db: Sql }) {
    this.#db = opts.db;
  }
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return {} as User;
  }
  async findById(id: string): Promise<User | undefined> {
    return;
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return;
  }
  async delete(id: string): Promise<boolean> {
    return false;
  }
  async find(): Promise<User[]> {
    return [];
  }
}

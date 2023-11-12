import { type RequestHandler } from 'express';
import type { RefreshTokenRepository, UserRepository } from '../database.js';
import { BadRequest } from '../error/bad-request.js';

export class UsersController {
  #userRepository: UserRepository;
  #refreshTokenRepository: RefreshTokenRepository;
  constructor(opts: {
    userRepository: UserRepository;
    refreshTokenRepository: RefreshTokenRepository;
  }) {
    this.#userRepository = opts.userRepository;
    this.#refreshTokenRepository = opts.refreshTokenRepository;
  }

  public delete: RequestHandler = async ({ params: { id } }, res) => {
    const user = await this.#userRepository.findById(id);
    if (!user) throw new BadRequest('Entity not found');
    await this.#refreshTokenRepository.deleteByUserId(user.id);
    await this.#userRepository.delete(user.id);
    res.json(user);
  };

  public getAll: RequestHandler = async (_, res) => {
    const users = await this.#userRepository.find();

    res.json(users);
  };
}

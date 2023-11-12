import { verifyToken } from '../middleware/verify-token.middleware.js';
import { UsersController } from '../controllers/users.controller.js';
import { BaseRouter } from './base-router.js';

export class UserRouter extends BaseRouter {
  #usersController: UsersController;
  constructor(opts: { usersController: UsersController }) {
    super();
    this.#usersController = opts.usersController;
  }
  protected initializeEndpoints(): void {
    this.addAsyncEndpoint(
      'DELETE',
      '/users/:id',
      this.#usersController.delete,
      verifyToken
    );
    this.addAsyncEndpoint(
      'GET',
      '/users',
      this.#usersController.getAll,
      verifyToken
    );
  }
}

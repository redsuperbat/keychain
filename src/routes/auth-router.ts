import { AuthController } from '../controllers/auth.controller.js';
import { BaseRouter } from './base-router.js';

export class AuthRouter extends BaseRouter {
  #authController: AuthController;
  constructor(opts: { authController: AuthController }) {
    super();
    this.#authController = opts.authController;
  }
  protected initializeEndpoints(): void {
    this.addAsyncEndpoint('POST', '/register', this.#authController.register);
    this.addAsyncEndpoint('POST', '/login', this.#authController.login);
    this.addAsyncEndpoint(
      'POST',
      '/token/refresh',
      this.#authController.refreshToken
    );
  }
}

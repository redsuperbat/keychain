import { AuthController } from '../controllers/auth.controller'
import { BaseRouter } from './base-router'

export class AuthRouter extends BaseRouter {
  protected initializeEndpoints(): void {
    this.addAsyncEndpoint('POST', '/register', AuthController.register)
    this.addAsyncEndpoint('POST', '/login', AuthController.login)
    this.addAsyncEndpoint('POST', '/token/refresh', AuthController.refreshToken)
  }
}

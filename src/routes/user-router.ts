import { verifyToken } from '../middleware/verify-token.middleware'
import { UsersController } from '../controllers/users.controller'
import { BaseRouter } from './base-router'

export class UserRouter extends BaseRouter {
  protected initializeEndpoints(): void {
    this.addAsyncEndpoint('POST', '/register', UsersController.register)
    this.addAsyncEndpoint('POST', '/login', UsersController.login)
    this.addAsyncEndpoint('DELETE', '/:id', UsersController.delete, verifyToken)
    this.addAsyncEndpoint('GET', '/', UsersController.get_all, verifyToken)
  }
}

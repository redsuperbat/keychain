import { verifyToken } from '../middleware/verify-token.middleware'
import { UsersController } from '../controllers/users.controller'
import { BaseRouter } from './base-router'

export class UserRouter extends BaseRouter {
  protected initializeEndpoints(): void {
    this.addAsyncEndpoint('DELETE', '/users/:id', UsersController.delete, verifyToken)
    this.addAsyncEndpoint('GET', '/users', UsersController.get_all, verifyToken)
  }
}

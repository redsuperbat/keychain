import { HttpError } from './http-error'

export class Unauthorized extends HttpError {
  public statusCode: number = 401
}

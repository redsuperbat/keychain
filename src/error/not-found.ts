import { HttpError } from './http-error'

export class NotFound extends HttpError {
  public statusCode: number = 404
}

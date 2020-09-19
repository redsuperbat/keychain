import { HttpError } from './http-error'

export class BadRequest extends HttpError {
  public statusCode: number = 400
}

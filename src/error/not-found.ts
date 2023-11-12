import { HttpError } from './http-error.js';

export class NotFound extends HttpError {
  public statusCode: number = 404;
}

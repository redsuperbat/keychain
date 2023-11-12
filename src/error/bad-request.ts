import { HttpError } from './http-error.js';

export class BadRequest extends HttpError {
  public statusCode: number = 400;
}

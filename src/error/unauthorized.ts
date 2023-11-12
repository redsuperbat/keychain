import { HttpError } from './http-error.js';

export class Unauthorized extends HttpError {
  public statusCode: number = 401;
}

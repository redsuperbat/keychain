import { type ErrorRequestHandler } from 'express';
import { HttpError } from '../error/http-error.js';

/**
 * Middleware that checks all errors that are send trough
 * express and if the error is a httpError sends a http
 * status request back with the message passed into the
 * error when it was created.
 * @param next Is required for this middleware to function.
 * DO NOT REMOVE THIS PARAMETER.
 */
export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    const httpError: HttpError = err;
    res.status(httpError.statusCode).json({
      statusCode: httpError.statusCode,
      message: httpError.message,
    });
    return;
  }
  res.status(500).json({
    statusCode: 500,
    message: err.message,
  });
};

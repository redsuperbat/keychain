import type { RequestHandler } from 'express';
import { NotFound } from '../error/not-found.js';

export const pathNotFoundMiddleware: RequestHandler = (req, res, next) => {
  throw new NotFound('Path not found');
};

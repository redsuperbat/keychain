import { RequestHandler } from 'express'
import { NotFound } from '../error/not-found'

export const pathNotFoundMiddleware: RequestHandler = (req, res, next) => {
  throw new NotFound('Path not found')
}

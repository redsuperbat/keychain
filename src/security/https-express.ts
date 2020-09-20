import { Request, RequestHandler } from 'express'
import { Unauthorized } from '../error/unauthorized'

export class HttpExpress {
  public static retrieveBearerTokenFromRequest(req: Request) {
    // Check if auth-header is present
    if (!req.headers.authorization) throw new Unauthorized('No auth header present')

    let authoriziationHeader = req.headers.authorization

    if (authoriziationHeader.startsWith('Bearer '))
      authoriziationHeader = authoriziationHeader.substring('Bearer '.length, authoriziationHeader.length)

    return authoriziationHeader
  }

  public static wrapAsync(fn: RequestHandler): RequestHandler {
    return function (req, res, next?) {
      fn(req, res, next).catch(next)
    }
  }
}

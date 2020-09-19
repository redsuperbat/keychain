import { Request, RequestHandler } from 'express'

export class HttpExpress {
  public static retrieveBearerTokenFromRequest(req: Request) {
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

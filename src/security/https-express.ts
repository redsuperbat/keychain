import type { Request, RequestHandler } from 'express';
import { Unauthorized } from '../error/unauthorized.js';

export class HttpExpress {
  public static retrieveBearerTokenFromRequest(req: Request) {
    // Check if auth-header is present
    if (!req.headers.authorization) {
      throw new Unauthorized('No auth header present');
    }

    let authorizationHeader = req.headers.authorization;

    if (authorizationHeader.startsWith('Bearer '))
      authorizationHeader = authorizationHeader.substring('Bearer '.length, authorizationHeader.length);

    return authorizationHeader;
  }

  public static wrapAsync(fn: RequestHandler): RequestHandler {
    return function (req, res, next?) {
      // @ts-expect-error this will be an async fn
      fn(req, res, next).catch(next);
    };
  }
}

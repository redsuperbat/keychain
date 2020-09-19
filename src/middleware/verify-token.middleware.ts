import { RequestHandler } from 'express'
import { Unauthorized } from '../error/unauthorized'
import { HttpExpress } from '../security/https-express'
import { JWT } from '../security/jwt'

/**
 * Verifies JWT, throws Unauthorized error if not verified.
 */

export const verifyToken: RequestHandler = (req, res, next) => {
  // retrieve the token
  const token = HttpExpress.retrieveBearerTokenFromRequest(req)

  // validate the token, we want to thow an unauthorized error if token was invalid
  if (!JWT.isTokenValid(token)) throw new Unauthorized('JWT is not valid')

  // execute next if the token is valid
  next()
}

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware.js';
import { AppBuilder } from './appBuilder.js';
import { UserRouter } from './routes/user-router.js';
import { pathNotFoundMiddleware } from './middleware/path-not-found.middleware.js';
import { AuthRouter } from './routes/auth-router.js';
import postgres from 'postgres';
import { RefreshTokenRepository, UserRepository } from './database.js';
import { UsersController } from './controllers/users.controller.js';
import { AuthController } from './controllers/auth.controller.js';
import { JWT } from './security/jwt.js';
import helm from 'helmet';

const app = express();

const appBuilder = new AppBuilder(app);
const sql = postgres();

const refreshTokenRepository = new RefreshTokenRepository({ db: sql });
const jwt = new JWT({ refreshTokenRepository });
const userRepository = new UserRepository({ db: sql });
const usersController = new UsersController({
  refreshTokenRepository,
  userRepository,
});
const authController = new AuthController({
  refreshTokenRepository,
  jwt,
  userRepository,
});

export const server = appBuilder
  .addMiddleware(bodyParser.json()) // Parsing util
  .addMiddleware(bodyParser.urlencoded({ extended: false }))
  .addMiddleware(cors()) // Set cors headers
  .addMiddleware(helm())
  .addRouter(new UserRouter({ usersController }))
  .addRouter(new AuthRouter({ authController }))
  .addMiddleware(errorMiddleware)
  .addMiddleware(pathNotFoundMiddleware) // Last resort middleware
  .build();

server.start(process.env.PORT ? parseInt(process.env.PORT) : 4001);

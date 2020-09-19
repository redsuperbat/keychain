import 'reflect-metadata'
import * as express from 'express'
import * as cors from 'cors'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import { Database } from './database'
import { errorMiddleware } from './middleware/error.middleware'
import { AppBuilder } from './appBuilder'
import { UserRouter } from './routes/user-router'
import { pathNotFoundMiddleware } from './middleware/path-not-found.middleware'

const app = express()

// Init appbuilder
const appBuilder = new AppBuilder(app)

export const startService = async () => {
  // Init database
  await Database.init()

  await appBuilder
    .addMiddleware(bodyParser.json()) // Parsing util
    .addMiddleware(bodyParser.urlencoded({ extended: false }))
    // .addMiddleware(morgan('dev')) // Logging tool
    .addMiddleware(cors()) // Set cors headers
    .addRouter(new UserRouter())
    .addMiddleware(pathNotFoundMiddleware) // Throws error if path is not found which is handled in the error middleware
    .addMiddleware(errorMiddleware) // custom error handling
    .build(+process.env.PORT || 4001)
}

startService()

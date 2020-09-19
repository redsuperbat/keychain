import { ErrorRequestHandler, Express, RequestHandler, Router } from 'express'
import { BaseRouter } from './routes/base-router'

export class AppBuilder {
  constructor(private readonly app: Express) {}

  public addRouter(router: BaseRouter) {
    router.initializeRouter(this.app)
    return this
  }

  public addMiddleware(middlewareHandler: ErrorRequestHandler | RequestHandler) {
    this.app.use(middlewareHandler)
    return this
  }

  public build(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`)
        resolve()
      })
    })
  }
}

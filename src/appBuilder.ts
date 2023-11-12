import type { ErrorRequestHandler, Express, RequestHandler } from 'express';
import { BaseRouter } from './routes/base-router.js';
import type { Server } from 'node:http';

export class AppBuilder {
  constructor(private readonly app: Express) {}

  public addRouter(router: BaseRouter) {
    router.initializeRouter(this.app);
    return this;
  }

  public addMiddleware(
    middlewareHandler: ErrorRequestHandler | RequestHandler
  ) {
    this.app.use(middlewareHandler);
    return this;
  }

  public build(): { start: (port: number, callback?: () => void) => Server } {
    return {
      start: (port, callback) =>
        this.app.listen(port, () => {
          console.log(`Server is listening on port ${port}...`);
          !!callback ?? callback?.();
        }),
    };
  }
}

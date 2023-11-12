import type { RequestHandler, Express } from 'express';
import { HttpExpress } from '../security/https-express.js';

export type HttpMethods = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';

export type EndpointFactory = (
  httpMethod: HttpMethods,
  route: string,
  requestHandler: RequestHandler,
  ...middlewares: RequestHandler[]
) => any;

export abstract class BaseRouter {
  private app!: Express;

  public initializeRouter(app: Express) {
    this.app = app;
    this.initializeEndpoints();
  }

  protected abstract initializeEndpoints(): void;

  public addEndpoint: EndpointFactory = (httpMethod, route, requestHandler, ...middlewares) => {
    switch (httpMethod) {
      case 'GET':
        middlewares ? this.app.get(route, middlewares, requestHandler) : this.app.get(route, requestHandler);
        break;
      case 'PUT':
        middlewares ? this.app.put(route, middlewares, requestHandler) : this.app.put(route, requestHandler);
        break;
      case 'POST':
        middlewares ? this.app.post(route, middlewares, requestHandler) : this.app.post(route, requestHandler);
        break;
      case 'PATCH':
        middlewares ? this.app.patch(route, middlewares, requestHandler) : this.app.patch(route, requestHandler);
        break;
      case 'DELETE':
        middlewares ? this.app.delete(route, middlewares, requestHandler) : this.app.delete(route, requestHandler);
        break;
    }
  };

  public addAsyncEndpoint: EndpointFactory = (httpMethod, route, requestHandler, ...middlewares) =>
    this.addEndpoint(httpMethod, route, HttpExpress.wrapAsync(requestHandler), ...middlewares);
}

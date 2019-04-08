import * as path from 'path';

const result = require('dotenv-flow').config({
  cwd: '../../',
  default_node_env: 'development'
});

if (result.error) {
  throw result.error;
}

console.log(process.env.TYPEORM_TYPE);
import { Request, Response } from 'express';
import GraphQLServer from './server/GraphQLServer';
import { resolvers } from './modules';

export const server: GraphQLServer = new GraphQLServer(resolvers);

/**
 * If environment in development, start local dev server
 */
(async () => {
  if (process.env.NODE_ENV === 'development') {
    await server.startDevelopment();
  }
})();

/**
 * Expose api function which handles HTTP request/responses in PRODUCTION
 * *Note changing the name of this function will require a change to deploy commands
 */
export const api = (req: Request, res: Response) => {
  // direct all HTTP request handling to express/GraphQLServer
  server.http(req, res);
};

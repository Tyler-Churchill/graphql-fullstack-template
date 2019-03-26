import 'reflect-metadata';
import { Request, Response } from 'express';
import { MainResolver } from './modules/main/main.module';
import GraphQLServer from './server/GraphQLServer';
import { UserResolver } from './modules/user/UserResolvers';

const server: GraphQLServer = new GraphQLServer([MainResolver, UserResolver]);

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

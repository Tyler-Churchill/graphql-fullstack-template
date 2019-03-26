import { ApolloServer, defaultPlaygroundOptions } from 'apollo-server-express';
import * as express from 'express';
import * as cors from 'cors';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { createConnection, Connection, useContainer } from 'typeorm';
import * as session from 'express-session';
import { checkAuth } from '../modules/auth/Auth';
import { AppContext } from '../middleware/AppContext';

/**
 * A GraphQL server capable of being ran on google cloud functions/aws lambda
 */
class GraphQLServer {
  express: any;
  server: ApolloServer;
  schema: any;
  resolvers: Array<any> = [];
  connection: Connection;

  async _createDBConnection() {
    return await createConnection();
  }

  async _bootstrap() {
    //Register IOC container
    useContainer(Container);
    this.schema = await buildSchema({
      resolvers: this.resolvers,
      container: Container,
      authChecker: checkAuth,
      authMode: 'error'
    });
    this.server = new ApolloServer({
      schema: this.schema,

      context: ({ req, res }: any) => {
        const ctx: AppContext = {
          req,
          res,
          userId: req.session.userId
        };
        return ctx;
      },

      playground: {
        ...defaultPlaygroundOptions,
        settings: {
          ...defaultPlaygroundOptions.settings,
          'request.credentials': 'include'
        }
      }
    });
    this.connection = await this._createDBConnection();
    this.express.use(
      cors({
        credentials: true,
        origin: 'http://localhost:4000' // TODO
      })
    );
    this.express.use(
      session({
        name: 'qid',
        secret: 'superdupersecretscret', // TODO abstract to env or google stored secret
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years/??
        }
      })
    );
    // Hook in express into ApolloServer
    this.server.applyMiddleware({ app: this.express });
  }

  constructor(resolvers: Array<any> = []) {
    // TODO: dont use <any>
    this.express = express();
    this.resolvers = resolvers;
  }

  /**
   * Expose express HTTP request handler
   * @param req
   * @param res
   */
  async http(req: express.Request, res: express.Response) {
    this.express(req, res);
  }

  /**
   * Start server for local development
   */
  async startDevelopment() {
    await this._bootstrap();
    await this.express.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${this.server.graphqlPath}`
      )
    );
  }
}

export default GraphQLServer;
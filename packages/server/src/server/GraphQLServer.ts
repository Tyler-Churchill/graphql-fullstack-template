import * as path from 'path';

require('dotenv-flow').config({
  cwd: path.resolve(__dirname + '/../../../../')
});

import 'reflect-metadata';
import { ApolloServer, defaultPlaygroundOptions } from 'apollo-server-express';
import * as express from 'express';
import * as cors from 'cors';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import * as TypeORM from 'typeorm';
import queryComplexity, {
  fieldConfigEstimator,
  simpleEstimator
} from 'graphql-query-complexity';
import * as session from 'express-session';
import { checkAuth } from '../modules/auth/Auth';
import { AppContext } from '../middleware/AppContext';
import { entities } from '../../../common/src/Entities';

/**
 * A GraphQL server capable of being ran on google cloud functions/aws lambda
 */
class GraphQLServer {
  express: any;
  server: ApolloServer;
  schema: any;
  resolvers: Array<any> = [];
  connection: TypeORM.Connection | null;

  async _createDBConnection() {
    TypeORM.useContainer(Container);
    try {
      const connection: TypeORM.Connection = await TypeORM.createConnection({
        name: process.env.TYPEORM_CONNECTION_NAME,
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: Number(process.env.TYPEORM_PORT),
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: !!process.env.TYPEORM_SYNCHRONIZE,
        logging: !!process.env.TYPEORM_LOGGING,
        entities: entities,
        migrations: ['./migrations/**/*{.js,.ts}'],
        cli: {
          migrationsDir: './migrations'
        }
      });
      return connection;
    } catch (e) {}
    return null;
  }

  async _bootstrap() {
    this.connection = await this._createDBConnection();
    this.schema = await buildSchema({
      resolvers: this.resolvers,
      container: Container,
      authChecker: checkAuth,
      authMode: 'error'
    });
    this.server = new ApolloServer({
      schema: this.schema,
      context: ({ req, res }: any) => {
        // bridge between express request and apollo request which gets passed to resolvers
        // pass along the request, response, and userId to resolver context
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
      },
      validationRules: [
        queryComplexity({
          maximumComplexity: 8,
          variables: {},
          estimators: [
            fieldConfigEstimator(),
            simpleEstimator({
              defaultComplexity: 1
            })
          ]
        }) as any
      ]
    });
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

  /**
   * Start server for integration testing
   */
  async startTest() {
    await this._bootstrap();
    await this.express.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${this.server.graphqlPath}`
      )
    );
  }
}

export default GraphQLServer;

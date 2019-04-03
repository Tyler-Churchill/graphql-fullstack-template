import GraphQLServer from '../server/GraphQLServer';
import { resolvers } from '../modules';
import { getConnection } from 'typeorm';

let server: GraphQLServer;

const startTestServer = async () => {
  // start dev server
  server = new GraphQLServer(resolvers);
  await server.startTest();
};

module.exports = async () => {
  await startTestServer();
};

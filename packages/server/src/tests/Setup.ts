import GraphQLServer from '../server/GraphQLServer';
import { resolvers } from '../modules';

let server: GraphQLServer;

const startTestServer = async () => {
  server = new GraphQLServer(resolvers);
  await server.startTest();
};

module.exports = async () => {
  await startTestServer();
};

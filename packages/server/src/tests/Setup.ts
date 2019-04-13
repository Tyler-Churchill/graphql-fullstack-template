import GraphQLServer from '../server/GraphQLServer';
import { resolvers } from '../modules';
import {} from 'typeorm-typedi-extensions';
import { getConnection } from 'typeorm';

let server: GraphQLServer;

const startTestServer = async () => {
  server = new GraphQLServer(resolvers);
  await server.startLocal();
  // restore database to fresh
  await getConnection().dropDatabase();
  await getConnection().synchronize();
};

module.exports = async () => {
  await startTestServer();
};

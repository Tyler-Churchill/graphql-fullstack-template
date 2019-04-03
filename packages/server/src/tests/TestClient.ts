import ApolloClient from 'apollo-boost';
import * as fetch from 'isomorphic-fetch';

const TestClient = new ApolloClient({
  uri: 'http://127.0.0.1:4000/graphql',
  fetch
});

export default TestClient;

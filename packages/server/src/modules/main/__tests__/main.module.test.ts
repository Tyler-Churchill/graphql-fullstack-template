import { gql } from 'apollo-server-core';
import TestClient from '../../../tests/TestClient';

it('Server isReady returns true', async () => {
  const resp = await TestClient.query({
    query: gql`
      query {
        isReady
      }
    `
  });

  expect(resp).toMatchSnapshot();
});

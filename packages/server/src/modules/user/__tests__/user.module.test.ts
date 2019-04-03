import { gql } from 'apollo-server-core';
import TestClient from '../../../tests/TestClient';

it('Can register by email', async () => {
  const resp = await TestClient.mutate({
    mutation: gql`
      mutation {
        registerByEmail(email: "ttwwt@awadw.com", password: "testtest") {
          email
          firstName
          lastName
          isEmailVerified
          roles
        }
      }
    `
  });
  expect(resp).toMatchSnapshot();
});

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

it('Can login by email', async () => {
  const email = 'testemail@email.com';
  const password = 'testtest';
  await TestClient.mutate({
    mutation: gql`
      mutation {
        registerByEmail(email: "${email}", password: "${password}") {
          email
          firstName
          lastName
          isEmailVerified
          roles
        }
      }
    `
  });
  const resp = await TestClient.mutate({
    mutation: gql`
      mutation {
        loginByEmail(email: "${email}", password: "${password}") {
          email
        }
      }
    `
  });
  expect(resp).toMatchSnapshot();
});

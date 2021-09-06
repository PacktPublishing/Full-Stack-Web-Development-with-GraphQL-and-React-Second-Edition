import { gql, useQuery } from '@apollo/client';
import { USER_ATTRIBUTES } from '../fragments/userAttributes';

export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      ...userAttributes
    }
  }
  ${USER_ATTRIBUTES}
`;

export const useGetUserQuery = (variables) => useQuery(GET_USER, { variables: { ...variables }});

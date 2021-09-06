import { gql, useQuery } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      username
      avatar
    }
  }
`;

export const useCurrentUserQuery = (options) => useQuery(GET_CURRENT_USER, options);

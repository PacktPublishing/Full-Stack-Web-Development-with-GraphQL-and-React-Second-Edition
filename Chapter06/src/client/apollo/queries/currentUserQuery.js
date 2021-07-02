import { gql, useLazyQuery } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      username
      avatar
    }
  }
`;

export const useCurrentUserQuery = () => useLazyQuery(GET_CURRENT_USER);
import { gql, useQuery } from '@apollo/client';
import { USER_ATTRIBUTES } from '../fragments/userAttributes';

export const GET_USERS = gql`
  query usersSearch($page: Int, $limit: Int, $text: String!) {
    usersSearch(page: $page, limit: $limit, text: $text) {
      users {
        id
        ...userAttributes
      }
    }
  }
  ${USER_ATTRIBUTES}
`;

export const getUserSearchConfig = (text) => ({ variables: { page: 0, limit: 5, text }, skip: text.length < 3})

export const useUserSearchQuery = (text) => useQuery(GET_USERS, getUserSearchConfig(text))
import { gql } from '@apollo/client';
import { USER_ATTRIBUTES } from '../fragments/userAttributes';
import { useQuery } from '@apollo/client';

export const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
      posts {
        id
        text
        user {
          ...userAttributes
        }
      }
    }
  }
  ${USER_ATTRIBUTES}
`;

export const useGetPostsQuery = () => useQuery(GET_POSTS, { pollInterval: 5000, variables: { page: 0, limit: 10 } });
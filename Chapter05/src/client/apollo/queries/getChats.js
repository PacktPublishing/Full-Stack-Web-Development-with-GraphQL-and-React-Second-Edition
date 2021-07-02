import { gql } from '@apollo/client';
import { USER_ATTRIBUTES } from '../fragments/userAttributes';
import { useQuery } from '@apollo/client';

export const GET_CHATS = gql`
  query chats {
    chats {
      id
      users {
        id
        ...userAttributes
      }
      lastMessage {
        text
      }
    }
  }
  ${USER_ATTRIBUTES}
`;

export const useGetChatsQuery = () => useQuery(GET_CHATS);
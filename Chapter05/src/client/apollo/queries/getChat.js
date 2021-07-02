import { gql } from '@apollo/client';
import { USER_ATTRIBUTES } from '../fragments/userAttributes';
import { useQuery } from '@apollo/client';

export const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        ...userAttributes
      }
      messages {
        id
        text
        user {
            id
        }
      }
    }
  }
  ${USER_ATTRIBUTES}
`;

export const useGetChatQuery = (chatId) => useQuery(GET_CHAT, { variables: { chatId }});
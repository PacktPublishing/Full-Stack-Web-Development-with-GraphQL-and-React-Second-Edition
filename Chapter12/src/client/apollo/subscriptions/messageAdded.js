import { useSubscription, gql } from '@apollo/client';

export const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded {
    messageAdded {
      id
      text
      chat {
        id
      }
      user {
        id
        __typename
      }
      __typename
    }
  }
`;

export const useMessageAddedSubscription = (options) => useSubscription(MESSAGES_SUBSCRIPTION, options);

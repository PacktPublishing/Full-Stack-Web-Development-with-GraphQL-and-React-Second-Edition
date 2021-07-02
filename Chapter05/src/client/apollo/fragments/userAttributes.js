import { gql } from '@apollo/client';

export const USER_ATTRIBUTES = gql`
  fragment userAttributes on User {
    username
    avatar
  }
`;
import { gql, useMutation } from '@apollo/client';

export const LOGOUT = gql`
  mutation logout {
    logout {
      success
    }
  }
`;

export const useLogoutMutation = () => useMutation(LOGOUT);

import { gql, useMutation } from '@apollo/client';

export const SIGNUP = gql`
  mutation signup($email : String!, $password : String!, $username : String!) {
    signup(email : $email, password : $password, username : $username) {
      token
    }
  }
`;

export const useSignupMutation = () => useMutation(SIGNUP);

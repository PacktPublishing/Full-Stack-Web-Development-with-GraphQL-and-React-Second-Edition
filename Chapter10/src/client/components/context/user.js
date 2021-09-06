import React from 'react';
import { ApolloConsumer } from '@apollo/client';
import { GET_CURRENT_USER } from '../../apollo/queries/currentUserQuery';

export const UserConsumer = ({ children }) => {
  return (
    <ApolloConsumer>
      {client => {
        // Use client.readQuery to get the current logged in user.
        const result = client.readQuery({ query: GET_CURRENT_USER });
        return React.Children.map(children, function(child){
          return React.cloneElement(child, { user: result?.currentUser ? result.currentUser : null });
        });
      }}
    </ApolloConsumer>
  )
}

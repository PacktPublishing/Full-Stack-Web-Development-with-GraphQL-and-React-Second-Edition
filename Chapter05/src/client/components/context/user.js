import React from 'react';
import { ApolloConsumer } from '@apollo/client';

export const UserConsumer = ({ children }) => {
  return (
    <ApolloConsumer>
      {client => {
        // Use client.readQuery to get the current logged in user.
        const user = {
          username: "Test User",
          avatar: "/uploads/avatar1.png"
        };
        return React.Children.map(children, function(child){
          return React.cloneElement(child, { user });
        });
      }}
    </ApolloConsumer>
  )
}

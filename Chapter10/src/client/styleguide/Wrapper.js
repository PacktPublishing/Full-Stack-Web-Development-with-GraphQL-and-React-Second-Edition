import React from 'react';
import client from '../apollo';
import { ApolloProvider } from '@apollo/client/react';

const Wrapper = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}

export default Wrapper

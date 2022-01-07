import React from 'react';
import { ApolloProvider } from '@apollo/client';
import App from './app';

const ServerClient = ({ client, location, context, loggedIn }) => {
  return(
    <ApolloProvider client={client}>
      <App location={location} context={context} loggedIn={loggedIn}/>
    </ApolloProvider>
  );
}

export default ServerClient

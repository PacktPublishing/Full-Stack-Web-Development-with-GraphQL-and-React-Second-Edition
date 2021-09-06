import { ApolloClient, InMemoryCache, from, split } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const protocol = (location.protocol != 'https:') ? 'ws://': 'wss://';
const port = location.port ? ':'+location.port: '';
const httpLink = createUploadLink({
  uri: location.protocol + '//' + location.hostname + port +
   '/graphql',
  credentials: 'same-origin',
});

const SUBSCRIPTIONS_ENDPOINT = protocol + location.hostname + port + '/subscriptions';
const subClient = new SubscriptionClient(SUBSCRIPTIONS_ENDPOINT, {
  reconnect: true,
  connectionParams: () => {
    var token = localStorage.getItem('jwt');
    if(token) {
      return { authToken: token };
    }
    return { };
  }
});
const wsLink = new WebSocketLink(subClient);
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation ===
     'subscription';
  },
  wsLink,
  httpLink,
);

const AuthLink = (operation, next) => {
  const token = localStorage.getItem('jwt');
  if(token) {
    operation.setContext(context => ({
      ...context,
      headers: {
        ...context.headers,
        Authorization: `Bearer ${token}`,
      },
    }));
  }
  return next(operation);
};

const client = new ApolloClient({
  link: from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path, extensions }) => {
          if(extensions.code === 'UNAUTHENTICATED') {
            localStorage.removeItem('jwt');
            client.clearStore()
          }
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }
    }),
    AuthLink,
    link,
  ]),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

export default client;

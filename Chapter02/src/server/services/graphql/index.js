import { ApolloServer } from 'apollo-server-express';
import Schema from './schema';
import Resolvers from './resolvers';

const server = new ApolloServer({
    typeDefs: Schema,
    resolvers: Resolvers,
    context: ({ req }) => req
});

export default server;
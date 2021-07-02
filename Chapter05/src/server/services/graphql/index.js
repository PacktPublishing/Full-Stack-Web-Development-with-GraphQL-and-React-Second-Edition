import { ApolloServer } from 'apollo-server-express';
import Schema from './schema';
import Resolvers from './resolvers';

export default (utils) => {
    const server = new ApolloServer({
        typeDefs: Schema,
        resolvers: Resolvers.call(utils),
        context: ({ req }) => req
    });

    return server;
};

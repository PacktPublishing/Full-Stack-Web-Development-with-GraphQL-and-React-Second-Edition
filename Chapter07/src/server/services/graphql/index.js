import { ApolloServer } from 'apollo-server-express';
import Schema from './schema';
import Resolvers from './resolvers';
import auth from './auth';
import JWT from 'jsonwebtoken';
const { JWT_SECRET } = process.env;

export default (utils) => {
    const server = new ApolloServer({
        typeDefs: Schema,
        resolvers: Resolvers.call(utils),
        context: async ({ req }) => {
            const authorization = req.headers.authorization;
            if(typeof authorization !== typeof undefined) {
                var search = "Bearer";
                var regEx = new RegExp(search, "ig");
                const token = authorization.replace(regEx, '').trim();
                return JWT.verify(token, JWT_SECRET, function(err, result) {
                    if(err) {
                        return req;
                    } else {
                        return utils.db.models.User.findByPk(result.id).then((user) => {
                            return Object.assign({}, req, { user });
                        });
                    }
                });
            } else {
                return req;
            }
        },
        schemaDirectives: {
            auth: auth
        },
    });

    return server;
};

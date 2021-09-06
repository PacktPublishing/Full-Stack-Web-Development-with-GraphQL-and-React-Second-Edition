import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';

function authDirective(directiveName) {
  const typeDirectiveArgumentMaps = {};

  return {
    authDirectiveTypeDefs: `directive @${directiveName} on QUERY | FIELD_DEFINITION | FIELD`,
    authDirectiveTransformer: (schema) => mapSchema(schema, {
      [MapperKind.TYPE]: (type) => {
        const authDirective = getDirective(schema, type, directiveName)?.[0];
        if (authDirective) {
          typeDirectiveArgumentMaps[type.name] = authDirective;
        }
        return undefined;
      },
      [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName];
        if (authDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (source, args, context, info) {
            if (context.user) {
              return resolve(source, args, context, info);
            }
            throw new Error("You need to be logged in.");
          }
          return fieldConfig;
        }
      }
    }),
  };
}

export default authDirective;

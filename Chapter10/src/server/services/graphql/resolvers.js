import logger from '../../helpers/logger';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import {
  GraphQLUpload
} from 'graphql-upload';
import aws from 'aws-sdk';
import { PubSub, withFilter } from 'graphql-subscriptions';
const pubsub = new PubSub();

const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: 'eu-central-1',
});
const Op = Sequelize.Op;
const {
  JWT_SECRET
} = process.env;

const cookieExpiration = 1;

export default function resolver() {
    const {
        db
    } = this;
    const {
        Post,
        User,
    Chat,
    Message
  } = db.models;

  const resolvers = {
    Upload: GraphQLUpload,
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      },
    },
    Chat: {
      lastMessage(chat, args, context) {
        return chat.getMessages({
          limit: 1,
          order: [
            ['id', 'DESC']
          ]
        }).then((message) => {
          return message[0];
        });
      },
      messages(chat, args, context) {
        return chat.getMessages({
          order: [
            ['id', 'ASC']
          ]
        });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
    },
    RootQuery: {
      usersSearch(root, {
        page,
        limit,
        text
      }, context) {
        if (text.length < 3) {
          return {
            users: []
          };
        }
        var skip = 0;
        if (page && limit) {
          skip = page * limit;
        }
        var query = {
          order: [
            ['createdAt', 'DESC']
          ],
          offset: skip,
        };
        if (limit) {
          query.limit = limit;
        }
        query.where = {
          username: {
            [Op.like]: '%' + text + '%'
          }
        };
        return {
          users: User.findAll(query)
        };
      },
      user(root, {
        username
      }, context) {
        return User.findOne({
          where: {
            username
          }
        });
      },
      postsFeed(root, {
        page,
        limit,
        username
      }, context) {
        var skip = 0;

        if (page && limit) {
          skip = page * limit;
        }

        var query = {
          order: [
            ['createdAt', 'DESC']
          ],
          offset: skip,
        };

        if (limit) {
          query.limit = limit;
        }

        if (username) {
          query.include = [{
            model: User
          }];
          query.where = {
            '$User.username$': username
          };
        }

        return {
          posts: Post.findAll(query)
        };
      },
      posts(root, args, context) {
        return Post.findAll({
          order: [
            ['createdAt', 'DESC']
          ]
        });
      },
      chats(root, args, context) {
        return Chat.findAll({
          include: [{
              model: User,
              required: true,
              through: {
                where: {
                  userId: context.user.id
                }
              },
            },
            {
              model: Message,
            }
          ],
        });
      },
      chat(root, {
        chatId
      }, context) {
        return Chat.findByPk(chatId, {
          include: [{
              model: User,
              required: true,
            },
            {
              model: Message,
            }
          ],
        });
      },
      currentUser(root, args, context) {
        return context.user;
      },
    },
    RootSubscription: {
      messageAdded: {
        subscribe: withFilter(() => pubsub.asyncIterator('messageAdded'),
            (payload, variables, context) => {
                if (payload.messageAdded.UserId !== context.user.id) {
                    return Chat.findOne({
                        where: {
                            id: payload.messageAdded.ChatId
                        },
                        include: [{
                            model: User,
                            required: true,
                            through: {
                                where: {
                                    userId: context.user.id
                                }
                            },
                        }],
                    }).then((chat) => {
                        if (chat !== null) {
                            return true;
                        }
                        return false;
                    })
                }
                return false;
            }),
    }
    },
    RootMutation: {
      addMessage(root, { message }, context) {
        logger.log({
            level: 'info',
            message: 'Message was created',
        });
        return Message.create({
            ...message,
        }).then((newMessage) => {
          return Promise.all([
              newMessage.setUser(context.user.id),
              newMessage.setChat(message.chatId),
          ]).then(() => {
              pubsub.publish('messageAdded', { messageAdded:
              newMessage });
              return newMessage;
          });
        });
      },
      logout(root, params, context) {
        context.cookies.set(
          'authorization',
          '', { signed: true, expires: new Date(), httpOnly: true, secure: false, sameSite: 'strict' }
        );
        return {
          message: true
        };
      },
      signup(root, {
        email,
        password,
        username
      }, context) {
        return User.findAll({
          where: {
            [Op.or]: [{
              email
            }, {
              username
            }]
          },
          raw: true,
        }).then(async (users) => {
          if (users.length) {
            throw new Error('User already exists');
          } else {
            return bcrypt.hash(password, 10).then((hash) => {
              return User.create({
                email,
                password: hash,
                username,
                activated: 1,
              }).then((newUser) => {
                const token = JWT.sign({
                  email,
                  id: newUser.id
                }, JWT_SECRET, {
                  expiresIn: '1d'
                });
                const expirationDate = new Date();
                expirationDate.setDate(
                  expirationDate.getDate() + cookieExpiration
                );

                context.cookies.set(
                  'authorization',
                  token, { signed: true, expires: expirationDate, httpOnly: true, secure: false, sameSite: 'strict' }
                );
                return {
                  token
                };
              });
            });
          }
        });
      },
      login(root, {
        email,
        password
      }, context) {
        return User.findAll({
          where: {
            email
          },
          raw: true
        }).then(async (users) => {
          if (users.length = 1) {
            const user = users[0];
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
              throw new Error('Password does not match');
            }
            const token = JWT.sign({
              email,
              id: user.id
            }, JWT_SECRET, {
              expiresIn: '1d'
            });
            const expirationDate = new Date();
            expirationDate.setDate(
              expirationDate.getDate() + cookieExpiration
            );

            context.cookies.set(
              'authorization',
              token, { signed: true, expires: expirationDate, httpOnly: true, secure: false, sameSite: 'strict' }
            );

            return {
              token
            };
          } else {
            throw new Error("User not found");
          }
        });
      },
      addChat(root, {
        chat
      }, context) {
        return Chat.create().then((newChat) => {
          return Promise.all([
            newChat.setUsers(chat.users),
          ]).then(() => {
            logger.log({
              level: 'info',
              message: 'Message was created',
            });
            return newChat;
          });
        });
      },
      async uploadAvatar(root, {
        file
      }, context) {
        const {
          createReadStream,
          filename,
          mimetype,
          encoding
        } = await file;
        const bucket = 'apollo-book';
        const params = {
          Bucket: bucket,
          Key: context.user.id + '/' + filename,
          ACL: 'public-read',
          Body: createReadStream()
        };

        const response = await s3.upload(params).promise();

        return User.update({
          avatar: response.Location
        }, {
          where: {
            id: context.user.id
          }
        }).then(() => {
          return {
            filename: filename,
            url: response.Location
          }
        });
      },
      addPost(root, {
        post
      }, context) {
        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Post.create({
            ...post,
          }).then((newPost) => {
            return Promise.all([
              newPost.setUser(usersRow.id),
            ]).then(() => {
              logger.log({
                level: 'info',
                message: 'Post was created',
              });
              return newPost;
            });
          });
        });
      },
      deletePost(root, {
        postId
      }, context) {
        return Post.destroy({
          where: {
            id: postId
          }
        }).then(function (rows) {
          if (rows === 1) {
            logger.log({
              level: 'info',
              message: 'Post ' + postId + 'was deleted',
            });
            return {
              success: true
            };
          }
          return {
            success: false
          };
        }, function (err) {
          logger.log({
            level: 'error',
            message: err.message,
          });
        });
      },
    },
  };

  return resolvers;
}
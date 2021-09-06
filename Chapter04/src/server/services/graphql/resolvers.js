import logger from '../../helpers/logger';

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
      postsFeed(root, {
        page,
        limit
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
        return User.findAll().then((users) => {
          if (!users.length) {
            return [];
          }

          const usersRow = users[0];

          return Chat.findAll({
            include: [{
                model: User,
                required: true,
                through: {
                  where: {
                    userId: usersRow.id
                  }
                },
              },
              {
                model: Message,
              }
            ],
          });
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
    },
    RootMutation: {
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
      addMessage(root, {
        message
      }, context) {
        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(usersRow.id),
              newMessage.setChat(message.chatId),
            ]).then(() => {
              logger.log({
                level: 'info',
                message: 'Message was created',
              });
              return newMessage;
            });
          });
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
    },
  };

  return resolvers;
}
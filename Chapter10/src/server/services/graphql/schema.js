const typeDefinitions = `
  directive @auth on QUERY | FIELD_DEFINITION | FIELD
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type Post {
    id: Int
    text: String
    user: User
  }

  type User {
    id: Int
    avatar: String
    username: String
  }

  type Message {
    id: Int
    text: String
    chat: Chat
    user: User
  }

  type Chat {
    id: Int
    messages: [Message]
    lastMessage: Message
    users: [User]
  }

  type PostFeed {
    posts: [Post]
  }

  type RootQuery {
    user(username: String!): User @auth
    currentUser: User @auth
    posts: [Post]
    chats: [Chat] @auth
    chat(chatId: Int): Chat
    postsFeed(page: Int, limit: Int, username: String): PostFeed @auth
    usersSearch(page: Int, limit: Int, text: String!): UsersSearch
  }

  input PostInput {
    text: String!
  }

  input ChatInput {
    users: [Int]
  }

  input MessageInput {
    text: String!
    chatId: Int!
  }

  type Response {
    success: Boolean
  }

  type UsersSearch {
    users: [User]
  }

  type Auth {
    token: String
  }

  type RootMutation {
    addPost (
      post: PostInput!
    ): Post @auth
    addChat (
      chat: ChatInput!
    ): Chat @auth
    addMessage (
      message: MessageInput!
    ): Message @auth
    deletePost (
      postId: Int!
    ): Response
    login (
      email: String!
      password: String!
    ): Auth
    signup (
      username: String!
      email: String!
      password: String!
    ): Auth
    uploadAvatar (
      file: Upload!
    ): File @auth
    logout: Response @auth
  }

  type RootSubscription {
    messageAdded: Message
  }

  schema {
    query: RootQuery
    mutation: RootMutation
    subscription: RootSubscription
  }
`;

export default [typeDefinitions];

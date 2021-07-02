import { gql } from 'apollo-server-express';

const typeDefinitions = gql`
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
    posts: [Post]
    chats: [Chat]
    chat(chatId: Int): Chat
    postsFeed(page: Int, limit: Int): PostFeed
    usersSearch(page: Int, limit: Int, text: String!): UsersSearch
  }

  input PostInput {
    text: String!
  }

  input UserInput {
    username: String!
    avatar: String!
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

  type RootMutation {
    addPost (
      post: PostInput!
    ): Post
    addChat (
      chat: ChatInput!
    ): Chat
    addMessage (
      message: MessageInput!
    ): Message
    deletePost (
      postId: Int!
    ): Response
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default typeDefinitions;
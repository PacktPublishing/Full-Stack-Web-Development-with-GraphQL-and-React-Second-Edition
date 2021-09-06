import { gql, useMutation } from '@apollo/client';
import { USER_ATTRIBUTES } from '../fragments/userAttributes';

export const ADD_POST = gql`
  mutation addPost($post : PostInput!) {
    addPost(post : $post) {
      id
      text
      user {
        ...userAttributes
      }
    }
  }
  ${USER_ATTRIBUTES}
`;

export const getAddPostConfig = (postContent) => ({
  optimisticResponse: {
    __typename: "mutation",
    addPost: {
      __typename: "Post",
      text: postContent,
      id: -1,
      user: {
        __typename: "User",
        username: "Loading...",
        avatar: "/public/loading.gif"
      }
    }
  },
  update(cache, { data: { addPost } }) {
    cache.modify({
      fields: {
        postsFeed(existingPostsFeed) {
          const { posts: existingPosts } = existingPostsFeed;
          const newPostRef = cache.writeFragment({
            data: addPost,
            fragment: gql`
              fragment NewPost on Post {
                id
                type
              }
            `
          });
          return {
            ...existingPostsFeed,
            posts: [newPostRef, ...existingPosts]
          };
        }
      }
    });
  }
});

export const useAddPostMutation = (postContent) => useMutation(ADD_POST, getAddPostConfig(postContent));

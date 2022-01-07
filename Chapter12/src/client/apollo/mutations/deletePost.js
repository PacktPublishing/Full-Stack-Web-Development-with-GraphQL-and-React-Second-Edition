import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

export const DELETE_POST = gql`
  mutation deletePost($postId : Int!) {
    deletePost(postId : $postId) {
      success
    }
  }
`;

export const getDeletePostConfig = (postId) => ({
  update(cache, { data: { deletePost: { success } } }) {
    if(success) {
      cache.modify({
        fields: {
          postsFeed(postsFeed, { readField }) {
            return {
              ...postsFeed,
              posts: postsFeed.posts.filter(postRef => postId !== readField('id', postRef))
            }
          }
        }
      });
    }
  }
});

export const useDeletePostMutation = (postId) => useMutation(DELETE_POST, getDeletePostConfig(postId));

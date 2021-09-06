import { gql, useMutation } from '@apollo/client';

const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($file: Upload!) {
    uploadAvatar(file : $file) {
      filename
      url
    }
  }
`;

export const getUploadAvatarConfig = () => ({
  update(cache, { data: { uploadAvatar } }) {
    if(uploadAvatar && uploadAvatar.url) {
      cache.modify({
        fields: {
          currentUser(user, { readField }) {
            cache.modify({
              id: user,
              fields: {
                avatar() {
                  return uploadAvatar.url;
                }
              }
            })
          }
        }
      });
    }
  }
});

export const useUploadAvatarMutation = () => useMutation(UPLOAD_AVATAR, getUploadAvatarConfig());

import React from 'react';
import PostHeader from './header';
import PostContent from './content';
import PropTypes from 'prop-types';

const Post = ({ post }) => {
  return (
    <div className={"post " + (post.id < 0 ? "optimistic": "")}>
      <PostHeader post={post}/>
      <PostContent post={post}/>
    </div>
  )
}

Post.propTypes = {
  /** Object containing the complete post. */
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
}

export default Post

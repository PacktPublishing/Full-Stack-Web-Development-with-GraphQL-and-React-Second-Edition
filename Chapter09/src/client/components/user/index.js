import React from 'react';
import FeedList from '../post/feedlist';
import UserHeader from './header';
import Loading from '../loading';
import Error from '../error';
import { useGetPostsQuery } from '../../apollo/queries/getPosts';
import { useGetUserQuery } from '../../apollo/queries/getUser';

const UserProfile = ({ username }) => {
  const { data: user, loading: userLoading } = useGetUserQuery({ username });
  const { loading, error, data: posts, fetchMore } = useGetPostsQuery({ username });

  if (loading || userLoading) return <Loading />;
  if (error) return <Error><p>{error.message}</p></Error>;

  return (
    <div className="user">
      <div className="inner">
        <UserHeader user={user.user} />
      </div>
      <div className="container">
        <FeedList posts={posts.postsFeed.posts} fetchMore={fetchMore}/>
      </div>
    </div>
  )
}

export default UserProfile;

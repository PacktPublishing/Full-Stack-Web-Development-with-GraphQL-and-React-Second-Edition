import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './components/loading';
import Error from './components/error';
import Post from './components/post';
import FeedList from './components/post/feedlist';
import { useGetPostsQuery } from './apollo/queries/getPosts';
import { useAddPostMutation } from './apollo/mutations/addPost';

const Feed = () => {
    const [postContent, setPostContent] = useState('');
    const [page, setPage] = useState(0);
    const { loading, error, data, fetchMore } = useGetPostsQuery();
    const [addPost] = useAddPostMutation(postContent);

    const loadMore = () => {
        fetchMore({
            variables: {
                page: page + 1,
            },
            updateQuery(previousResult, { fetchMoreResult }) {
                if(!fetchMoreResult.postsFeed.posts.length) {
                    setHasMore(false);
                    return previousResult;
                }

                setPage(page + 1);

                const newData = {
                    postsFeed: {
                        __typename: 'PostFeed',
                        posts: [
                            ...previousResult.postsFeed.posts,
                            ...fetchMoreResult.postsFeed.posts
                        ]
                    }
                };
                return newData;
            }
        });
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        addPost({ variables: { post: { text: postContent } } });
        setPostContent('');
    };

    if (loading) return <Loading />;
    if (error) return <Error><p>{error.message}</p></Error>;

    const { postsFeed } = data;
    const { posts } = postsFeed;

    return (
        <div className="container">
            <div className="postForm">
                <form onSubmit={handleSubmit}>
                    <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Write your custom post!"/>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <FeedList posts={posts} fetchMore={loadMore}/>
        </div>
    )
}

export default Feed
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';

const GET_POSTS = gql`
    query postsFeed($page: Int, $limit: Int) {
        postsFeed(page: $page, limit: $limit) {
            posts {
                id
                text
                user {
                    avatar
                    username
                }
            }
        }
    }
`;

const ADD_POST = gql`
    mutation addPost($post : PostInput!) {
        addPost(post : $post) {
            id
            text
            user {
                username
                avatar
            }
        }
    }
`;


const Feed = () => {
    const [postContent, setPostContent] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const { loading, error, data, fetchMore } = useQuery(GET_POSTS, { pollInterval: 5000, variables: { page: 0, limit: 10 } });
    const [addPost] = useMutation(ADD_POST, {
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

    const loadMore = (fetchMore) => {
        const self = this;

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

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

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
            <div className="feed">
                <InfiniteScroll
                    dataLength={posts.length}
                    next={() => loadMore(fetchMore)}
                    hasMore={hasMore}
                    loader={<div className="loader" key={"loader"}>Loading ...</div>}
                >
                    {posts.map((post, i) =>
                        <div key={post.id} className={'post ' + (post.id < 0 ? 'optimistic': '')}>
                            <div className="header">
                                <img src={post.user.avatar} />
                                <h2>{post.user.username}</h2>
                            </div>
                            <p className="content">{post.text}</p>
                        </div>
                    )}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Feed
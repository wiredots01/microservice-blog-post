import axios from "axios";
import React, { useEffect, useState } from "react";
import { CommentCreate, CommentList } from "../Comments";

interface Icomment {
  id: string;
  content: string;
  status: string;
};

interface PostListProps {
  [key: string]: {
    id: string;
    title: string;
    comments: Icomment[];
  }
};


export const PostList: React.FC<PostListProps> = () => {
  const [posts, setPosts] = useState<PostListProps>({});

  const fetchPosts = async() => {
    const res = await axios.get('http://posts.com/posts');
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map(post  => {
    return (
      <div
        className="card"
        style={{ width: '30%', marginBottom: '20px' }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  })

  console.log('posts', posts)
  return (
    <div className="d-flex  flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

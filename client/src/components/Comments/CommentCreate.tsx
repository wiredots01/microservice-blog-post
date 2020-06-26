import axios from "axios";
import React, { useState } from 'react';

interface CommentCreateProps {
  postId: string;
};

export const CommentCreate: React.FC<CommentCreateProps> = ({ postId }) => {
  const [content, setContent] = useState<string>('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content
    });
    setContent('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="">New Comment</label>
          <input className="form-control" onChange={e => setContent(e.target.value)} />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};


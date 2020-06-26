import axios from "axios";
import React, { useState } from 'react';

interface PostCreateProps {

};

export const PostCreate: React.FC<PostCreateProps> = () => {
  const [title, setTitle] = useState('');

  const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios.post('http://posts.com/posts/create', {
      title
    });
    setTitle('');
  }
  
  return (
    <div>
      <p>This is the PostCreate view</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};


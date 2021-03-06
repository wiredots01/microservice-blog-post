import React from 'react';

interface IComment {
  id: string;
  content: string;
  status: string;
}

interface CommentListProps {
  comments: IComment[];
};



export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  
  const renderedComments = comments.map(comment => {
    let content = comment.content;
    if (comment.status === 'rejected') {
      content = 'This comment has been rejected';
    }
    if (comment.status === 'pending') {
      content = 'This comment is awaiting moderation';
    }
    return <li key={comment.id}>{content}</li>;
  });


  return (
    <div>
      <ul>
        {renderedComments}
      </ul>
    </div>
  );
};


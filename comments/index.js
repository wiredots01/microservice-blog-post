const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};
const eventBusUri = 'http://event-bus-srv:4005/events';

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { id } = req.params;
  const { content } = req.body;
  const comments = commentsByPostId[id] || [];
  comments.push({ id: commentId, content, status: 'pending' });
  

  await axios.post(eventBusUri, {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: id, status: 'pending' }
  });
  
  commentsByPostId[id] = comments;
  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log(`recieved event: ${type}`);

  if (type === 'CommentModerated') {
    const { id, postId, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find(com => {
      return com.id === id;
    });
    comment.status = status;
    // commentsByPostId[postId] = comment;
    await axios.post(eventBusUri, {
      type: 'CommentUpdated',
      data: {
        id,
        postId,
        status,
        content
      }
    });
    console.log(JSON.stringify(commentsByPostId));
  }
  res.send({});
});

const port = 4001;
app.listen(port, () => {
  console.log(`COMMENTS --> listening at port: ${port}`);
});
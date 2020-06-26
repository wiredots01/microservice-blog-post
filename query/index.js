const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const eventBusUri = 'http://event-bus-srv:4005/events';
const posts = {};
const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title} = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find(com => {
      return com.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
}
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);
  console.log(JSON.stringify(posts));
  res.send({});
});

const port = 4002
app.listen(port, async () => {
  console.log('loading events from event bus...')
  const res = await axios.get(eventBusUri);
  for (let event of res.data) {
    const { type, data} = event;
    console.log('Processing event: ', type);
    handleEvent(type, data);
  }
  console.log('loading events done from event bus!!!');
  console.log(`QUERY --> listening to port: ${port}`);
});

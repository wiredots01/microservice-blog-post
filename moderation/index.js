const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  const eventBusUri = 'http://event-bus-srv:4005/events';

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    const {id, postId, content} = data;
    await axios.post(eventBusUri, {
      type: 'CommentModerated',
      data: {
        id,
        postId,
        content,
        status
      }
    })
  }
  res.send({});
});

const port = 4003;
app.listen(port, () => {
  console.log(`MODERATION --> listening to port ${port}`);
});
const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
  const eventBusUri = "http://event-bus-srv:4005/events";
  await axios.post(eventBusUri, {
    type: "PostCreated",
    data: { id, title },
  });
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log(`recieved event: ${type}`);
  res.send({});
});

const port = 4000;
app.listen(port, () => {
  console.log("v123");
  console.log(`POSTS --> listening at port: ${port}`);
});

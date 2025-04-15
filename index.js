require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const db = require("./models");
const postsRouter = require("./routes/Posts");
const usersRouter = require("./routes/Auth");
const commentsRouter = require("./routes/Comments");
const postLikesRouter = require("./routes/PostLikes");
const followsRouter = require("./routes/Follows");
const path = require("path");

app.use("/posts", postsRouter);
app.use("/auth", usersRouter);
app.use("/comments", commentsRouter);
app.use("/postLikes", postLikesRouter);
app.use("/users", followsRouter);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

db.sequelize.sync().then(() => {
  app.listen(process.env.APP_PORT || 3001, () => {
    console.log("Rodando servidor");
  });
});

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

app.use("/posts", postsRouter);
app.use("/auth", usersRouter);
app.use("/comments", commentsRouter);
app.use("/postLikes", postLikesRouter);
app.use("/users", followsRouter);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Rodando servidor");
  });
});

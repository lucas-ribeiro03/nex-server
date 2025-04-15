const express = require("express");
const router = express.Router();
const { Posts, Users, PostLikes } = require("../models");
const validateToken = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
  const posts = await Posts.findAll({
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["username"],
      },
      {
        model: PostLikes,
        as: "likes",
        attributes: ["userId"],
      },
    ],
  });
  res.json(posts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  const { id } = req.user;
  post.userId = id;
  const newPost = await Posts.create(post);
  res.json(newPost);
});

router.get("/userPosts/:username", validateToken, async (req, res) => {
  const { username } = req.params;
  const user = await Users.findOne({ where: { username } });
  console.log("user:", user.id);
  const userPosts = await Posts.findAll({
    where: { userId: user.id },
    include: {
      model: PostLikes,
      as: "likes",
      attributes: ["userId"],
    },
    order: [["createdAt", "DESC"]],
  });
  res.json(userPosts);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findOne({
    where: { id },
    include: {
      model: Users,
      as: "user",
      attributes: ["username"],
    },
  });
  res.json(post);
});

router.delete("/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  await Posts.destroy({ where: { id } });
  res.json(id);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { PostLikes, Users } = require("../models");
const validateToken = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { id } = req.user;
  const like = req.body;
  like.userId = id;
  console.log(req.user, req.body);

  const postlike = await PostLikes.create(like);
  res.json(postlike);
});

router.get("/", validateToken, async (req, res) => {
  const { id } = req.user;
  const likedPosts = await PostLikes.findAll({ where: { userId: id } });
  console.log("likedPosts:", likedPosts);
  if (!likedPosts) return res.json({ message: "Não há posts curtidos" });
  res.json(likedPosts);
});

router.get("/wholiked", async (req, res) => {
  const whoLiked = await PostLikes.findAll({
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["username"],
      },
    ],
  });

  res.json(whoLiked);
});

router.get("/:id", validateToken, async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const checkIfIsLiked = await PostLikes.findOne({
    where: {
      userId,
      postId,
    },
  });

  const likesCounter = await PostLikes.findAll({
    where: { postId },
  });

  let message = "Post não curtido";

  if (checkIfIsLiked) message = "Post Curtido";
  res.json({ message, likesCounter });
});

router.delete("/:id", validateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await PostLikes.findOne({ where: { postId, userId } });
  res.json(post.postId);
  await PostLikes.destroy({
    where: { postId, userId },
  });
});

module.exports = router;

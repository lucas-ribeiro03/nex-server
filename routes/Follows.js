const express = require("express");
const router = express.Router();
const { Comments, Posts, Users, Follow } = require("../models");
const validateToken = require("../middlewares/AuthMiddleware");

router.post("/:id/follow", validateToken, async (req, res) => {
  const followerId = req.user.id;
  const username = req.params.id;

  const userToFollow = await Users.findOne({ where: { username } });
  const followingId = userToFollow.id;
  const checkFollow = await Follow.findOne({
    where: { followerId, followingId },
  });

  if (checkFollow) return res.json("Usuário já está sendo seguido");

  if (followingId === followerId)
    return res.json({ error: "Você não pode seguir  a si mesmo!" });

  const follow = await Follow.create({ followerId, followingId });

  res.json(follow);
});

router.get("/:username/followers/", validateToken, async (req, res) => {
  const user = req.user.id;
  const { username } = req.params;
  const { id } = await Users.findOne({ where: { username } });

  const following = await Follow.findAll({
    where: { followerId: id },
    include: {
      model: Users,
      as: "followingUser",
      attributes: ["username"],
    },
  });
  const followers = await Follow.findAll({
    where: { followingId: id },
    include: {
      model: Users,
      as: "followerUser",
      attributes: ["username"],
    },
  });
  res.json({ followers, following, user });
});

router.delete("/:username", validateToken, async (req, res) => {
  const { username } = req.params;
  const idLoggedUser = req.user.id;

  const { id } = await Users.findOne({ where: { username } });

  await Follow.destroy({
    where: { followingId: id, followerId: idLoggedUser },
  });
  res.json(id);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { Comments, Posts, Users, Follow, Notifications } = require("../models");
const validateToken = require("../middlewares/AuthMiddleware");

router.post("/follow", validateToken, async (req, res) => {
  const senderId = req.user.id;

  const receiver = await Users.findOne({
    where: { username: req.body.username },
  });

  const receiverId = receiver.id;

  const notification = await Notifications.create({
    notificationType: "follow",
    isRead: false,
    receiverId,
    senderId,
  });

  res.json({ notification });
});

router.post("/like", validateToken, async (req, res) => {
  const body = req.body.id;
  const senderId = req.user.id;

  const post = await Posts.findByPk(body);

  const receiverId = post.userId;

  if (senderId === receiverId) return res.json({ message: "NAO" });

  const notification = await Notifications.create({
    notificationType: "like",
    isRead: false,
    postId: body,
    receiverId,
    senderId,
  });

  res.json(notification);
});

router.post("/comment", validateToken, async (req, res) => {
  const sender = req.user.id;
  const { postId } = req.body;
  const receiver = await Posts.findByPk(postId);

  if (sender === receiver.id) return;

  const notification = await Notifications.create({
    notificationType: "comment",
    isRead: false,
    receiverId: receiver.userId,
    senderId: sender,
    postId,
  });

  res.json(notification);
});

router.get("/", validateToken, async (req, res) => {
  const receiverId = req.user.id;
  const notification = await Notifications.findAll({
    where: { receiverId },
    include: [
      {
        model: Users,
        as: "sender",
        attributes: ["username"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(notification);
});

router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.body;
  const update = await Notifications.update(
    {
      isRead: true,
    },
    { where: { id } }
  );
  res.json(update);
});

module.exports = router;

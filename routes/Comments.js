const express = require("express");
const router = express.Router();
const { Comments, Users } = require("../models");
const validateToken = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { id, username } = req.user;

  const comment = req.body;
  comment.user.username = username;
  comment.userId = id;
  await Comments.create(comment);
  res.json(comment);
});

router.get("/", async (req, res) => {
  const comments = await Comments.findAll();
  res.json(comments);
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const comment = await Comments.findAll({
      where: { postId },
      include: {
        model: Users,
        as: "user",
        attributes: ["username"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar comentários", details: err });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ error: "ERRO!!" });
  Comments.destroy({ where: { id } });
  res.json("comentario deletado");
});

module.exports = router;

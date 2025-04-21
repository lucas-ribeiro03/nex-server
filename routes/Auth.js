const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { Users } = require("../models");
const validateToken = require("../middlewares/AuthMiddleware");

router.post("/signup", async (req, res) => {
  const { email, username, nickname, password } = req.body;
  let cleanUsername = "";
  if (username) {
    cleanUsername = username
      .replace(/[^a-zA-Z0-9._]/g, "")
      .trim()
      .toLowerCase();
  }

  let check;

  if (email) {
    const checkIfEmailExists = await Users.findOne({
      where: { email },
    });

    check = checkIfEmailExists;
    if (check) return res.json({ error: "Email  já cadastrado" });
  } else if (username) {
    const checkIfUsernameExists = await Users.findOne({
      where: { username: `@${cleanUsername}` },
    });

    check = checkIfUsernameExists;
    if (check) return res.json({ error: "Nome de usuário já cadastrado" });
  }

  if (!password) return res.json("Usuário encontrado, aguardando senha");
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await Users.create({
    email,
    username: `@${cleanUsername}`,
    nickname,
    password: hashedPassword,
  });

  res.json(newUser);
});

router.post("/signin", async (req, res) => {
  const { identifier, password } = req.body;
  const user = await Users.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { username: `@${identifier}` }],
    },
  });

  if (!user) return res.json({ error: "Usuário nao encontrado" });

  if (!password) return res.json("user");

  const passCompare = await bcrypt.compare(password, user.password);

  if (!passCompare) return res.json({ error: "Senha inválida" });

  const accessToken = sign(
    { username: user.username, id: user.id },
    "çslnfsoekjnfseçnfsoenf"
  );

  res.json(accessToken);
});

router.post("/google", async (req, res) => {
  const { username, nickname, email, password } = req.body;
  let cleanUsername = "";
  if (username) {
    cleanUsername = username
      .replace(/[^a-zA-Z0-9._]/g, "")
      .trim()
      .toLowerCase();
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const checkIfUserExists = await Users.findOne({ where: { email } });
  if (checkIfUserExists) {
    const accessToken = sign(
      { username, id: checkIfUserExists.id },
      "çslnfsoekjnfseçnfsoenf"
    );

    return res.json(accessToken);
  }
  const postUser = await Users.create({
    email,
    username: `@${cleanUsername}`,
    nickname,
    password: hashedPassword,
  });
  const accessToken = sign(
    { username, id: postUser.id },
    "çslnfsoekjnfseçnfsoenf"
  );
  return res.json(accessToken);
});

router.post("/search-users", async (req, res) => {
  console.log("to aqui hein");
  const { username } = req.body;
  const user = await Users.findAll({
    where: {
      username: {
        [Op.like]: `%@${username}%`,
      },
    },
  });
  res.json(user);
});

router.get("/", validateToken, async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.json({ error: "Você precisa estar logado" });
  const userLogged = await Users.findByPk(userId, {
    attributes: ["id", "username"],
  });
  res.json(userLogged);
});

router.get("/:username", validateToken, async (req, res) => {
  const { username } = req.user;
  const profileUsername = req.params.username;
  const state = username === profileUsername ? "Owner" : "Viewer";

  const usernameToSearch =
    username === profileUsername ? username : profileUsername;
  const user = await Users.findOne({ where: { username: usernameToSearch } });
  res.json({ user, state });
});

router.put("/", validateToken, async (req, res) => {
  const { id } = req.user;
  const { nickname, bio } = req.body;
  const userEdited = await Users.update(
    {
      nickname,
      bio,
    },
    { where: { id } }
  );

  res.json(userEdited);
});

module.exports = router;

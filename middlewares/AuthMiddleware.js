const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "Usuário não está logado" });

  try {
    const validToken = verify(accessToken, "çslnfsoekjnfseçnfsoenf");
    req.user = validToken;
    if (validToken) console.log("passou do middleware");
    if (validToken) return next();
  } catch (e) {
    console.log("erro: ", e);
  }
};

module.exports = validateToken;

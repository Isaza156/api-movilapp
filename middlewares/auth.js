const jwt = require("jsonwebtoken");
const { authSecretKey } = require("../config/config");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("access denied!! 😡");
  try {
    const verified = jwt.verify(token, authSecretKey);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("invalid token");
  }
};

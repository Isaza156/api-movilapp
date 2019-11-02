const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { authSecretKey } = require("../config/config");

function loginApi(app) {
  router.post("/login", async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
      try {
        if (err || !user)
          return next(
            `An error ocurred${!info ? err.toString() : ": " + info.message}`
          );

        req.login(user, { session: false }, async error => {
          if (error) return next(error);
          const token = await jwt.sign(
            {
              _id: user._id
            },
            authSecretKey
          );
          res.header("auth-token", token).send("logged in");
        });
      } catch (err) {
        return next(err);
      }
    })(req, res, next);
  });

  app.use("/api", router);
}

module.exports = loginApi;

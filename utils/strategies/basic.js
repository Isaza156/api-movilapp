const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Strategy, ExtractJwt } = require("passport-jwt");

const UserService = require("../../services/usuarios.service");
const { authSecretKey } = require("../../config/config");
const { validateLoginData } = require("../validations/user.validations");

passport.use(
  new Strategy(
    {
      secretOrKey: authSecretKey || "datos_quemados_mala_practica",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        done(null, token);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const { error } = validateLoginData({ email, password });
        if (error)
          return done(null, false, { message: error.details[0].message });

        const user = await new UserService().getAll({ email });
        if (user.length <= 0)
          return done(null, false, { message: "email or password is wrong" });

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword)
          return done(null, false, { message: "email or password is wrong" });
        done(null, user, { message: "Right" });
      } catch (err) {
        return done(err);
      }
    }
  )
);

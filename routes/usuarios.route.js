const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  usersSchemaValidator
} = require("../utils/validations/user.validations");
const checkDataTypes = require("../middlewares/checkDataTypes");
const UsersService = require("../services/usuarios.service");
const bcrypt = require("bcrypt");

module.exports = function usuariosApi(app) {
  app.use("/api/usuarios", router);

  const userService = new UsersService();

  router
    .route("/")
    .get(async (req, res, next) => {
      try {
        const users = await userService.getAll(req.query);
        if (users.length < 1)
          return res
            .status(400)
            .send("user not found")
            .end();
        res
          .status(200)
          .send(users)
          .end();
      } catch (err) {
        next(err);
      }
    })
    .post(checkDataTypes(usersSchemaValidator), async (req, res, next) => {
      try {
        let { name, phone, email, password, confirm_password } = req.body;
        if (password !== confirm_password)
          return res
            .status(400)
            .send({ error: "passwords do not match" })
            .end();
        const user = await userService.register({
          name,
          phone,
          email,
          password
        });
        res.status(200).send(user);
      } catch (err) {
        next(err);
      }
    });

  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userService.login(email);

      if (!user) return res.status(400).json({ authRes: "email not found" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(400).json({ authRes: "wrong pass" });

      res.status(200).send(user._id);
    } catch (err) {
      next(err);
    }
  });

  router
    .route("/:id")
    // .all(auth)
    .get(async (req, res, next) => {
      try {
        const user = await userService.getOne(req.params.id);
        if (!user) return res.status(400).send("user not found");
        res.status(200).send(user);
      } catch (err) {
        next(err);
      }
    })
    .put(async (req, res, next) => {
      try {
        await userService.update(req.params.id, req.body);
        res.status(200).send({ message: "updated user" });
      } catch (err) {
        next(err);
      }
    })
    .delete(async (req, res, next) => {
      try {
        await userService.delete(req.params.id);
        res.status(200).send({ message: "deleted user" });
      } catch (err) {
        next(err);
      }
    });
};

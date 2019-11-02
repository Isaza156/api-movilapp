"use strict";
const { port } = require("./config/config");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

const publicacionesRoute = require("./routes/publicaciones.route");
const comentariosRoute = require("./routes/comentarios.route");
const loginRoute = require("./routes/login.route");
const usuariosRoute = require("./routes/usuarios.route");
const geolocationRoute = require('./routes/geolocation.route')

// middlewares

app.use(express.json()).use(cors());

//strategy
require("./utils/strategies/basic");

//routes
publicacionesRoute(app);
comentariosRoute(app);
loginRoute(app);
usuariosRoute(app);
geolocationRoute(app)

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "readme.md"));
});

const server = app.listen(port || process.env.port, () => {
  console.log(`App listening on port ${port}`);
  console.log("Press Ctrl+C to quit.");
});

require("./utils/sockets/sockets")(server);

module.exports = app;

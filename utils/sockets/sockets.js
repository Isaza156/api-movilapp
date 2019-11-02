// QUIERO APRENDER A DESACOPLAR UN HDP SOCKET NEIDER!!!
//Que gono*** de chorizo...
const GeoService = require("../../services/geolocation.service");

module.exports = function (server) {
  const io = require("socket.io")(server);

  io.on("connection", async socket => {
    const geoService = new GeoService();

    const geoid = await geoService.create({
      socketid: socket.id,
      start_timestamp: new Date().getTime(),
      activo: true,
      deltas: []
    });

    socket.on("new-delta", async location => {
      try {
        const geo = await geoService.getOne(geoid);

        geo.deltas.push(location);
        await geoService.update(geoid, { deltas: geo.deltas });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        await geoService.update(geoid, {
          end_timestamp: new Date().getTime()
        });
      } catch (err) {
        console.error(err);
      }
    });
  });
};

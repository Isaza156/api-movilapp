const router = require("express").Router();


const GeolocationService = require('../services/geolocation.service');


module.exports = function geolocationApi(app) {

    app.use('/api/geolocation', router);

    const geolocationService = new GeolocationService();

    router.route('/')
        .get(async function (req, res, next) { // read all
            try {
                const { tags } = req.query;
                const data = await geolocationService.getAll({ tags });
                // res.send({ data: data, message: 'products listed' })
                res.send(data)
            } catch (err) {
                next(err);
            }

        })
        .post(
            async (req, res, next) => {
                try {
                    let data = req.body
                    await geolocationService.create(data)
                    res.status(201).send("melos :3")
                } catch (err) {
                    next(err);
                }
            }
        );

    router.route('/:id')
        .get(async (req, res, next) => {// read one
            try {
                const data = await geolocationService.getOne(req.params.id);
                res.send(data)
            } catch (err) {
                next(err);
            }
        })
        .put(async (req, res, next) => {
            try {
                let data = req.body
                let id = req.params.id

                await geolocationService.updateOne(id, data)
                res.status(201).send("updated :3").end()
            } catch (err) {
                next(err);
            }
        })
        .delete(async (req, res, next) => {
            try {
                let id = req.params.id
                await geolocationService.delete(id)
                res.status(201).send("deleted :3").end()
            } catch (err) {
                next(err);
            }
        });

}


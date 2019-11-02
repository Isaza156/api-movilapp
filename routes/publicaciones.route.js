const router = require("express").Router();
const { publicacionSchemaValidator } = require('../utils/validations/publicaciones.validations')
const checkDataTypes = require('../middlewares/checkDataTypes')
const PublicacionesService = require('../services/publicaciones.service');

module.exports = function publicacionesApi(app) {

    app.use('/api/publicaciones', router);

    const publicacionesService = new PublicacionesService();

    router.route('/')
        .get(async function (req, res, next) {
            try {
                const data = await publicacionesService.getAll(req.query);
                if (data.length < 1) return res.status(400).send("publicaciones not found").end();
                res.status(200).send(data)
            } catch (err) {
                next(err);
            }

        })
        .post(
            checkDataTypes(publicacionSchemaValidator),
            async (req, res, next) => {
                try {
                    let data = req.body
                    const createdID = await publicacionesService.createOne(data)
                    res.status(201).send(createdID)
                } catch (err) {
                    next(err);
                }
            }
        );


    router.get('/getByUserId/:id', async (req, res, next) => {
        try {
            const data = await publicacionesService.getByUserId(req.params.id);
            res.status(200).send(data)
        } catch (err) {
            next(err);

        }
    });



    router.post('/addMany', async (req, res, next) => {
        try {
            let data = req.body
            await publicacionesService.createMany({ data })
            res.status(201).send(`added ${data.length} entries`).end()
        } catch (err) {
            next(err);
        }
    });



    router.route('/:id')
        .get(async (req, res, next) => {
            try {
                const data = await publicacionesService.getOne(req.params.id);
                res.send(data)
            } catch (err) {
                next(err);
            }
        })
        .put(async (req, res, next) => {
            try {
                let data = req.body
                let id = req.params.id

                await publicacionesService.updateOne(id, data)
                res.status(201).send("updated :3").end()
            } catch (err) {
                next(err);
            }
        })
        .delete(async (req, res, next) => {
            try {
                let id = req.params.id
                await publicacionesService.deleteOne(id)
                res.status(201).send("deleted :3").end()
            } catch (err) {
                next(err);
            }
        });
}


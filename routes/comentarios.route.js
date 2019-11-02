const router = require("express").Router();
const { comentarioSchemaValidator } = require('../utils/validations/comentarios.validations')
const checkDataTypes = require('../middlewares/checkDataTypes')
const ComentariosService = require('../services/comentarios.service');


module.exports = function comentariosApi(app) {

    app.use('/api/comentarios', router);

    const comentariosService = new ComentariosService();

    router.route('/')
        .get(async function (req, res, next) { // read all
            try {
                const { tags } = req.query;
                const data = await comentariosService.getAll({ tags });
                // res.send({ data: data, message: 'products listed' })
                res.send(data)
            } catch (err) {
                next(err);
            }

        })
        .post(
            checkDataTypes(comentarioSchemaValidator),
            async (req, res, next) => {
                try {
                    let data = req.body
                    await comentariosService.createOne(data)
                    res.status(201).send("melos :3")
                } catch (err) {
                    next(err);
                }
            }
        );


    router.post('/addMany', async (req, res, next) => {
        try {
            let data = req.body
            await comentariosService.createMany(data)
            res.status(201).send(`added ${data.length} entries`).end()
        } catch (err) {
            next(err);
        }
    });


    router.get('/getByPostId/:id', async (req, res, next) => {
        try {
            const data = await comentariosService.getByPostId(req.params.id);
            res.status(200).send(data)
        } catch (err) {
            next(err);

        }
    });



    router.route('/:id')
        .get(async (req, res, next) => {// read one
            try {
                const data = await comentariosService.getOne(req.params.id);
                res.send(data)
            } catch (err) {
                next(err);
            }
        })
        .put(async (req, res, next) => {
            try {
                let data = req.body
                let id = req.params.id

                await comentariosService.updateOne(id, data)
                res.status(201).send("updated :3").end()
            } catch (err) {
                next(err);
            }
        })
        .delete(async (req, res, next) => {
            try {
                let id = req.params.id
                await comentariosService.deleteOne(id)
                res.status(201).send("deleted :3").end()
            } catch (err) {
                next(err);
            }
        });
}


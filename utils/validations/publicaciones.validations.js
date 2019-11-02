const joi = require("@hapi/joi");

function publicacionSchemaValidator(data) {
    const PublicacionSchema = joi.object({
        uid: joi
            .string()
            .min(2)
            .max(50)
            .required(),

        titulo: joi
            .string()
            .min(3)
            .max(60)
            .required(),

        ubicacion: joi
            .string()
            .min(3),

        texto: joi
            .string()
            .min(1)
            .max(280)
            .required(),

        foto: joi
            .string()
            .default("no_foto_url"),

        likes: joi
            .number()
            .integer()
            .min(0)
            .default(0),

        esQueja: joi
            .bool()
            .default(false),

        entidades: joi
            .array()
            .required(),

        categorias: joi
            .array()
            .required(),

        comentarios: joi
            .array()
            .default([""]),
    });

    return PublicacionSchema.validate(data);
}
module.exports = { publicacionSchemaValidator }
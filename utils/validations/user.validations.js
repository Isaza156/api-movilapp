const joi = require("@hapi/joi");

function usersSchemaValidator(data) {
  const Schema = joi.object({
    name: joi
      .string()
      .min(2)
      .max(50)
      .required(),
    phone: joi
      .string()
      .min(3)
      .max(60),
    email: joi
      .string()
      .min(6)
      .max(60)
      .email()
      .required(),
    password: joi
      .string()
      .min(5)
      .max(255)
      .required(),
    confirm_password: joi.string().required()
  });

  return Schema.validate(data);
}

function validateLoginData(data) {
  const Schema = joi.object({
    email: joi
      .string()
      .min(6)
      .max(60)
      .email()
      .required(),
    password: joi
      .string()
      .min(5)
      .max(255)
      .required()
  });

  return Schema.validate(data);
}

module.exports = { usersSchemaValidator, validateLoginData };

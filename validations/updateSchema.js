const Joi = require("joi");
const updateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string().valid("user", "admin"),
}).min(1);

module.exports = updateSchema;

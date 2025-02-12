const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

module.exports = userSchema;

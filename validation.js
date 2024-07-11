const Joi = require('joi');

const registerValidation = data => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
  });
  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

const organizationValidation = data => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string()
  });
  return schema.validate(data);
};

const addUserToOrgValidation = data => {
  const schema = Joi.object({
    userId: Joi.string().required()
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  organizationValidation,
  addUserToOrgValidation
};

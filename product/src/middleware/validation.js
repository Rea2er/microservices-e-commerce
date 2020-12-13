const Joi = require('@hapi/joi');

// Product validation
const productValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().positive().required(),
  });
  return schema.validate(data);
};

module.exports.productValidation = productValidation;

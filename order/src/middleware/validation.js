const Joi = require('@hapi/joi');

// Product validation
const orderValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.orderValidation = orderValidation;

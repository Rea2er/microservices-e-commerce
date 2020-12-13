const Joi = require('@hapi/joi');

// Product validation
const paymentValidation = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    orderId: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.paymentValidation = paymentValidation;

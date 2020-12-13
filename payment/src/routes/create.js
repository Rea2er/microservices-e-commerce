const router = require('express').Router();
const { requireLogin } = require('../middleware/requirelogin');
const { paymentValidation } = require('../middleware/validation');
const ValidationError = require('../errors/validationerror');
const BadRequestError = require('../errors/badrequesterror');
const Order = require('../model/Order');
const Payment = require('../model/Payment');
const Stripe = require('stripe');
const nats = require('node-nats-streaming');
const mongoose = require('mongoose');

const strpie = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2020-03-02',
});

const client = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  'http://nats-serv:4222'
);

router.post('/api/payment', requireLogin, async (req, res) => {
  // Validate date before create product
  const { error } = paymentValidation(req.body);
  if (error) throw new ValidationError(error.details);

  const { token, orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new BadRequestError(404, 'Order not found');
  }
  if (order.userId !== req.currentUser.id) {
    throw new BadRequestError(401, 'Authenticated fail');
  }
  if (order.status == 'Canclled') {
    throw new BadRequestError(400, 'Order cancelled');
  }

  const charge = await strpie.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  });

  const payment = new Payment({
    orderId,
    stripeId: charge.id,
  });
  await payment.save();

  await client.publish(
    'payment:created',
    JSON.stringify({
      id: payment._id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
      productId: order.productId,
    }),
    () => {
      console.log('Event published to payment:created');
    }
  );

  res.status(201).send({ id: payment._id });
});

module.exports = router;

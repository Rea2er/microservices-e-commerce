const router = require('express').Router();
const { requireLogin } = require('../middleware/requirelogin');
const { orderValidation } = require('../middleware/validation');
const ValidationError = require('../errors/validationerror');
const BadRequestError = require('../errors/badrequesterror');
const Good = require('../model/Good');
const Order = require('../model/Order');
const nats = require('node-nats-streaming');
const mongoose = require('mongoose');

const client = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  'http://nats-serv:4222'
);

router.post('/api/orders', requireLogin, async (req, res) => {
  // // Validate date before create product
  const { error } = orderValidation(req.body);
  if (error) throw new ValidationError(error.details);

  const { productId } = req.body;
  const good = await Good.findById(productId);
  if (!good) {
    throw new BadRequestError(404, 'Good not found');
  }
  const existingOrder = await Order.findOne({
    product: good,
    status: {
      $in: ['Created', 'AwaitingPayment', 'Complete'],
    },
  });

  if (existingOrder) {
    throw new BadRequestError(400, 'Order already exist');
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 60);

  const order = new Order({
    userId: req.currentUser.id,
    status: 'Created',
    expiresAt: expiration,
    product: good,
  });

  try {
    const savedOrder = await order.save();
    await client.publish(
      'order:created',
      JSON.stringify({
        id: savedOrder._id,
        status: savedOrder.status,
        expiresAt: savedOrder.expiresAt.toISOString(),
        userId: savedOrder.userId,
        product: {
          id: good._id,
          price: good.price,
        },
      }),
      () => {
        console.log('Event published to order:created');
      }
    );
    res.status(201).send(savedOrder);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;

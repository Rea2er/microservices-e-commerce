const router = require('express').Router();
const { requireLogin } = require('../middleware/requirelogin');
const BadRequestError = require('../errors/badrequesterror');
const Order = require('../model/Order');
const nats = require('node-nats-streaming');
const mongoose = require('mongoose');

const client = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  'http://nats-serv:4222'
);

router.delete('/api/orders/:id', requireLogin, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('product');
  if (!order) {
    throw new BadRequestError(404, 'Order not found');
  }

  if (order.userId !== req.currentUser.id) {
    throw new BadRequestError(401, 'Authenticate fail');
  }

  order.status = 'Canclled';

  try {
    await order.save();
    await client.publish(
      'order:cancelled',
      JSON.stringify({
        id: order._id,
        product: {
          id: order.product._id,
        },
      }),
      () => {
        console.log('Event published to order:cancelled');
      }
    );
    res.status(204).send(order);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;

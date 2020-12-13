const router = require('express').Router();
const { requireLogin } = require('../middleware/requirelogin');
const { productValidation } = require('../middleware/validation');
const ValidationError = require('../errors/validationerror');
const Good = require('../model/Good');
const nats = require('node-nats-streaming');
const mongoose = require('mongoose');

const client = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  'http://nats-serv:4222'
);

router.post('/api/goods', requireLogin, async (req, res) => {
  // Validate date before create product
  const { error } = productValidation(req.body);
  if (error) throw new ValidationError(error.details);

  const { title, price } = req.body;
  const good = new Good({
    title,
    price,
    userId: req.currentUser.id,
  });

  try {
    const savedGood = await good.save();
    await client.publish(
      'good:created',
      JSON.stringify({
        id: savedGood._id,
        title: savedGood.title,
        price: savedGood.price,
        userId: savedGood.userId,
      }),
      () => {
        console.log('Event published to good:created');
      }
    );
    res.status(201).send(savedGood);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;

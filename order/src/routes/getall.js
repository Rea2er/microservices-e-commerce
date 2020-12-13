const router = require('express').Router();
const Order = require('../model/Order');
const { requireLogin } = require('../middleware/requirelogin');

router.get('/api/orders', requireLogin, async (req, res) => {
  const orders = await Order.find({
    userId: req.currentUser.id,
  }).populate('product');
  res.send(orders);
});

module.exports = router;

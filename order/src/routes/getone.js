const router = require('express').Router();
const Order = require('../model/Order');
const { requireLogin } = require('../middleware/requirelogin');
const BadRequestError = require('../errors/badrequesterror');

router.get('/api/orders/:id', requireLogin, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('product');
  if (!order) {
    throw new BadRequestError(404, 'Order not found');
  }
  if (order.userId !== req.currentUser.id) {
    throw new BadRequestError(401, 'Authenticate fail');
  }
  res.send(order);
});

module.exports = router;

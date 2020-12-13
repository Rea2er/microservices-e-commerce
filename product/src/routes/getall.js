const router = require('express').Router();
const Good = require('../model/Good');

router.get('/api/goods', async (req, res) => {
  const goods = await Good.find({
    orderId: undefined,
  });
  res.send(goods);
});

module.exports = router;

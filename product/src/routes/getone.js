const router = require('express').Router();
const Good = require('../model/Good');
const BadRequestError = require('../errors/badrequesterror');

router.get('/api/goods/:id', async (req, res) => {
  const good = await Good.findById(req.params.id);
  if (!good) {
    throw new BadRequestError(404, 'Good not found');
  }
  res.send(good);
});

module.exports = router;

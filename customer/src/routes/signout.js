const router = require('express').Router();

router.get('/api/users/signout', (req, res) => {
  req.session = null;
  res.send({});
});

module.exports = router;

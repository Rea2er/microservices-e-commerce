const router = require('express').Router();
const { verifyToken } = require('../middleware/verifytoken');

router.get('/api/users/currentuser', verifyToken, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

module.exports = router;

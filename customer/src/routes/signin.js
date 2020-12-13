const router = require('express').Router();
const { signValidation } = require('../middleware/validation');
const ValidationError = require('../errors/validationerror');
const BadRequestError = require('../errors/badrequesterror');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/api/users/signin', async (req, res) => {
  // Validate date before register user
  const { error } = signValidation(req.body);
  if (error) throw new ValidationError(error.details);

  // Checking if the user is already in the database
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError(400, 'Invalid email or password');
  }

  const validPass = await bcrypt.compare(password, existingUser.password);
  if (!validPass) throw new BadRequestError(400, 'Invalid email or password');

  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY
  );
  req.session.jwt = token;
  res.status(200).send({
    _id: existingUser.id,
    email: existingUser.email,
  });
});

module.exports = router;

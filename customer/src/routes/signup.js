const router = require('express').Router();
const { signValidation } = require('../middleware/validation');
const ValidationError = require('../errors/validationerror');
const BadRequestError = require('../errors/badrequesterror');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/api/users/signup', async (req, res) => {
  // Validate date before register user
  const { error } = signValidation(req.body);
  if (error) throw new ValidationError(error.details);

  // Checking if the user is already in the database
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError(400, 'Email already exist');
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({
    email: email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    const token = jwt.sign(
      { id: savedUser.id, email: savedUser.email },
      process.env.JWT_KEY
    );
    req.session.jwt = token;
    res.status(201).send({
      _id: savedUser.id,
      email: savedUser.email,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;

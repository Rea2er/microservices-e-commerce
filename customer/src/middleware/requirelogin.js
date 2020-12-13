const BadRequestError = require('../errors/badrequesterror');

const requireLogin = (req, res, next) => {
  if (!req.session.jwt) {
    throw new BadRequestError(400, 'Authenticated fail');
  }

  next();
};

module.exports.requireLogin = requireLogin;

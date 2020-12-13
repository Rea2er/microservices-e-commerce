const errorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }
};

module.exports.errorHandler = errorHandler;

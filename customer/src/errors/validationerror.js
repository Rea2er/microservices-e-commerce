class ValidationError extends Error {
  statusCode = 400;
  constructor(error) {
    super();
    this.error = error;
  }
  serializeErrors() {
    return [
      {
        message: this.error[0].message,
        param: this.error[0].path[0],
      },
    ];
  }
}

module.exports = ValidationError;

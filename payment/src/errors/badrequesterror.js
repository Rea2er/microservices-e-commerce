class BadRequestError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}

module.exports = BadRequestError;

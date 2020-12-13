const express = require('express');
require('express-async-errors');
const app = express();
const { errorHandler } = require('./middleware/errorhandler');
const { verifyToken } = require('./middleware/verifytoken');
const createRoute = require('./routes/create');
const cookieSession = require('cookie-session');
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(verifyToken);

// Route Middlewares
app.use(errorHandler);
app.use(createRoute);

module.exports = app;

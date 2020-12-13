const express = require('express');
require('express-async-errors');
const app = express();
const createRoute = require('./routes/create');
const getOneRoute = require('./routes/getone');
const getAllRoute = require('./routes/getall');
const { errorHandler } = require('./middleware/errorhandler');
const { verifyToken } = require('./middleware/verifytoken');
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
app.use(getOneRoute);
app.use(getAllRoute);

module.exports = app;

const express = require('express');
require('express-async-errors');
const app = express();
const currentUserRoute = require('./routes/currentuser');
const signInRoute = require('./routes/signin');
const signUpRoute = require('./routes/signup');
const signOutRoute = require('./routes/signout');
const { errorHandler } = require('./middleware/errorhandler');
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

// Route Middlewares
app.use(currentUserRoute);
app.use(signInRoute);
app.use(signUpRoute);
app.use(signOutRoute);
app.use(errorHandler);

module.exports = app;

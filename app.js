const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const AppError = require('./utils/AppError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip , try again in an hour',
});

app.use('/api', limiter);

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cannot found ${req.originalUrl} on this server !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

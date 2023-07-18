const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const AppError = require('./utils/AppError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();

// security http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  // log to consul the req
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip , try again in an hour',
});
// limiting the req by ip
app.use('/api', limiter);

// use this to be abale read the body , and limit the data until 20kb
app.use(express.json({ limit: '20kb' }));

// data sanitization against noSql query injection : like - "email":{"$gt":""},
app.use(mongoSanitize());

// data sanitization against cross site scripting (xss)
app.use(xssClean());

// prevent parameter pollution , can create white list
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'difficulty',
      'maxGroupSize',
    ],
  }),
);

// serving static files
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

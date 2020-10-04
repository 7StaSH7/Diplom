require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const NotFoundError = require('./errors/not-found-err');
const { notFoundMessage } = require('./errors/error-messages');
const errorHandler = require('./middlewares/error-handler');

const { appPort, mongoUrl } = require('./config');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');

const app = express();
const limiter = require('./middlewares/rate-limiter');

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, '/public')));

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use('/', routes);

app.use('*', (req, res, next) => {
  next(new NotFoundError(notFoundMessage));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);


app.listen(appPort);

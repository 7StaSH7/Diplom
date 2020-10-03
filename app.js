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
const errorHandler = require('./errors/error-handler');

const {
  PORT = 3000,
  NODE_ENV,
  MONGO_DB,
} = process.env;

const mongoUrl = NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/diplom';

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

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
  next(new NotFoundError('Ресурс не найден'));
});

app.use(errorLogger);
app.use(errorHandler);
app.use(errors());


app.listen(PORT);

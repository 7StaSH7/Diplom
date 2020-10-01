const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');
const AuthError = require('../errors/auth-err');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-req-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password.trim(), 10)
    .then((hash) => {
      User.create({
        email: email.trim(),
        password: hash,
        name: name.trim(),
      })
        .then((user) => res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'MongoError') next(new ConflictError('Пользователь с такими данными уже существует'));
          next(new BadRequestError(`Произошла ошибка при создании пользователя - ${err.message}`));
        });
    })
    .catch(() => next(new ServerError('Произошла ошибка при создании пользователя')));
};

module.exports.getSpecificUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(`Пользователь с таким id: ${req.user._id} не найден!`))
    .then((user) => res.send({ name: user.name, email: user.email }))
    .catch((err) => next(new ServerError(`Произошла ошибка при поиске пользователя - ${err.message}`)));
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secretphrase', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(() => next(new AuthError('Ошибка авторизации')));
};

module.exports.logout = (req, res) => {
  res.status(200).clearCookie('jwt', {
    httpOnly: true,
  })
    .end();
};

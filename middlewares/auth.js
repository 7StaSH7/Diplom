const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const { unauthorizedMessage } = require('../errors/error-messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new AuthError(unauthorizedMessage);
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secretphrase');
  } catch (err) {
    return next();
  }
  req.user = payload;

  next();
};

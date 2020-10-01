const router = require('express').Router();

const { signinValidator, signupValidator } = require('../validators/auth');
const { login, createUser, logout } = require('../controllers/users');

router.post('/signup', signupValidator, createUser);
router.post('/signin', signinValidator, login);
router.post('/logout', logout);

module.exports = router;

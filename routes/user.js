const router = require('express').Router();

const auth = require('../middlewares/auth');
const { getSpecificUser } = require('../controllers/users');

router.get('/users/me', auth, getSpecificUser);

module.exports = router;

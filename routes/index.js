const router = require('express').Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const articleRoutes = require('./article');

router.use(authRoutes);
router.use(userRoutes);
router.use(articleRoutes);

module.exports = router;

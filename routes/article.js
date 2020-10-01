const router = require('express').Router();

const auth = require('../middlewares/auth');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const { createArticleValidator, deleteArticleValidator } = require('../validators/article');

router.get('/articles', auth, getArticles);
router.post('/articles', auth, createArticleValidator, createArticle);
router.delete('/articles/:articleId', auth, deleteArticleValidator, deleteArticle);

module.exports = router;

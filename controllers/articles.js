const Article = require('../models/article');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      res.send(articles);
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const owner = req.user._id;
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  Article.create({
    keyword: keyword.trim(),
    title: title.trim(),
    text: text.trim(),
    source: source.trim(),
    link: link.trim(),
    image: image.trim(),
    owner,
    date,
  })
    .then((article) => {
      res.status(201).send(article);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { _id: owner } = req.user;
  const { articleId } = req.params;

  Article.removeIfOwner(owner, articleId)
    .then((article) => {
      res.send(article);
    })
    .catch(next);
};

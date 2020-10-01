const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/bad-req-err');

const createArticleValidator = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required().min(2),
    text: Joi.string().required().min(2),
    date: Joi.date().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value) => {
      if (validator.isURL(value)) return value;
      throw new BadRequestError('Неправильная ссылка');
    }),
    image: Joi.string().required().custom((value) => {
      if (validator.isURL(value)) return value;
      throw new BadRequestError('Неправильная ссылка');
    }),
  }),
});

const deleteArticleValidator = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().custom((value) => {
      if (validator.isMongoId(value)) return value;
      throw new BadRequestError('Неправильная ссылка');
    }),
  }),
});

module.exports = {
  createArticleValidator,
  deleteArticleValidator,
};

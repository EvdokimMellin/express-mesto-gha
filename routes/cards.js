const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCards, deleteCard, likeCard, removeLikeFromCard,
} = require('../controllers/cards');
const NotFoundError = require('../errors/NotFoundError');

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/https?:\/\/[\S]+/),
  }),
}), createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), removeLikeFromCard);

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;

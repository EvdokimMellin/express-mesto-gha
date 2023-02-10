/* eslint-disable consistent-return */
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

function createCard(req, res, next) {
  const {
    name, link,
  } = req.body;

  const owner = req.user._id;

  Card.create({
    name, link, owner,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
}

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Такой карточки не существует'));
      }
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new ForbiddenError('Вы не можете удалить эту карточку'));
      }
    })
    .then(() => Card.findByIdAndRemove(req.params.cardId))
    .then((card) => {
      if (card) {
        res.status(200).send({ message: 'Карточка удалена' });
      } else {
        return Promise.reject(new NotFoundError('Такой карточки не существует'));
      }
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ message: 'Лайк поставлен' });
      } else {
        return Promise.reject(new NotFoundError('Такой карточки не существует'));
      }
    })
    .catch(next);
}

function removeLikeFromCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ message: 'Лайк убран' });
      } else {
        return Promise.reject(new NotFoundError('Такой карточки не существует'));
      }
    })
    .catch(next);
}

module.exports = {
  createCard, getCards, deleteCard, likeCard, removeLikeFromCard,
};

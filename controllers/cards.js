const Card = require('../models/card');

function createCard(req, res) {
  const {
    name, link,
  } = req.body;

  const owner = req.user._id;

  Card.create({
    name, link, owner,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

function getCards(req, res) {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => {
      res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Такой карточки не существует' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => {
      res.status(200).send({ message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Такой карточки не существует' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

function removeLikeFromCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => {
      res.status(200).send({ message: 'Лайк убран' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Такой карточки не существует' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports = {
  createCard, getCards, deleteCard, likeCard, removeLikeFromCard,
};

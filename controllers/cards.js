/* eslint-disable consistent-return */
const Card = require('../models/card');

function createCard(req, res, next) {
  const {
    name, link,
  } = req.body;

  const owner = req.user._id;

  Card.create({
    name, link, owner,
  })
    .then((card) => res.status(200).send({ data: card }))
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     res.status(400).send({ message: 'Проверьте правильность введенных данных' });
    //     return;
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch(next);
}

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    // .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('Такой карточки не существует'));
      }
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new Error('Вы не можете удалить эту карточку'));
      }
    })
    .then(() => Card.findByIdAndRemove(req.params.cardId))
    .then((card) => {
      if (card) {
        res.status(200).send({ message: 'Карточка удалена' });
      } else {
        // res.status(404).send({ message: 'Такой карточки не существует' });
        return Promise.reject(new Error('Такой карточки не существует'));
      }
    })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     res.status(400).send({ message: 'Проверьте правильность введенных данных' });
    //     return;
    //   }
    //   if (err.message === 'Вы не можете удалить эту карточку') {
    //     res.status(403).send({ message: err.message });
    //     return;
    //   }
    //   if (err.message === 'Такой карточки не существует') {
    //     res.status(404).send({ message: 'Такой карточки не существует' });
    //     return;
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
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
        // res.status(404).send({ message: 'Такой карточки не существует' });
        return Promise.reject(new Error('Такой карточки не существует'));
      }
    })
    // .catch((err) => {
    //   if (err.name === 'ValidationError' || err.name === 'CastError') {
    //     res.status(400).send({ message: 'Проверьте правильность введенных данных' });
    //     return;
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
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
        // res.status(404).send({ message: 'Такой карточки не существует' });
        return Promise.reject(new Error('Такой карточки не существует'));
      }
    })
    // .catch((err) => {
    //   if (err.name === 'ValidationError' || err.name === 'CastError') {
    //     res.status(400).send({ message: 'Проверьте правильность введенных данных' });
    //     return;
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch(next);
}

module.exports = {
  createCard, getCards, deleteCard, likeCard, removeLikeFromCard,
};

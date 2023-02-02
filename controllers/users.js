const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
        return;
      }
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

function updateProfile(req, res) {
  if (req.body.name || req.body.about) {
    User.findByIdAndUpdate(req.user._id, req.body)
      .then(() => {
        res.status(200).send({ message: 'Профиль обновлен' });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(404).send({ message: 'Такого пользователя не существует' });
          return;
        }
        res.status(500).send({ message: 'Произошла неизвестная ошибка' });
      });
  } else {
    res.status(400).send({ message: 'Проверьте правильность введенных данных' });
  }
}

function updateAvatar(req, res) {
  if (req.body.avatar) {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
      .then(() => {
        res.status(200).send({ message: 'Аватар обновлен' });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(404).send({ message: 'Такого пользователя не существует' });
          return;
        }
        res.status(500).send({ message: 'Произошла неизвестная ошибка' });
      });
  } else {
    res.status(400).send({ message: 'Проверьте правильность введенных данных' });
  }
}

module.exports = {
  getUsers, createUser, getUser, updateProfile, updateAvatar,
};

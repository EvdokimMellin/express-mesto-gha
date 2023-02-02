const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(404).send({ message: 'Такого пользователя не существует' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
      res.send(err);
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
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(404).send({ message: 'Такого пользователя не существует' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function updateAvatar(req, res) {
  if (req.body.avatar) {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
      new: true, runValidators: true,
    })
      .then((user) => {
        if (user) {
          res.status(200).send({ data: user });
        } else {
          res.status(404).send({ message: 'Такого пользователя не существует' });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError' || err.name === 'ValidationError') {
          res.status(400).send({ message: 'Проверьте правильность введенных данных' });
          return;
        }
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  } else {
    res.status(400).send({ message: 'Проверьте правильность введенных данных' });
  }
}

module.exports = {
  getUsers, createUser, getUser, updateProfile, updateAvatar,
};

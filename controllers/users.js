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
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
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
      res.status(500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

function reqTest(req) {
  let isCorrect = false;
  if (req.body.name || req.body.about) {
    isCorrect = true;
  }
  if (req.body.name && isCorrect) {
    if (req.body.name.length >= 2 && req.body.name.length <= 30) {
      isCorrect = true;
    } else {
      isCorrect = false;
    }
  }
  if (req.body.about && isCorrect) {
    if (req.body.about.length >= 2 && req.body.about.length <= 30) {
      isCorrect = true;
    } else {
      isCorrect = false;
    }
  }
  return isCorrect;
}

function updateProfile(req, res) {
  if (reqTest(req)) {
    User.findByIdAndUpdate(req.user._id, req.body)
      .then((user) => {
        if (user) {
          const updatedUser = user; // user почему-то содержит данные до обновления,
          // поэтому мне пришлось менять их вручную для возвращения обновленных данных
          if (req.body.name) {
            updatedUser.name = req.body.name;
          }
          if (req.body.about) {
            updatedUser.about = req.body.about;
          }
          res.status(200).send({ data: updatedUser });
        } else {
          res.status(404).send({ message: 'Такого пользователя не существует' });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(400).send({ message: 'Проверьте правильность введенных данных' });
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
      .then((user) => {
        if (user) {
          const updatedUser = user;
          updatedUser.avatar = req.body.avatar;
          res.status(200).send({ data: updatedUser });
        } else {
          res.status(404).send({ message: 'Такого пользователя не существует' });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(400).send({ message: 'Проверьте правильность введенных данных' });
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

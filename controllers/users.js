/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const BadRequestError = require('../errors/BadRequestError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
// const ForbiddenError = require('../errors/ForbiddenError');
// const NotFoundError = require('../errors/NotFoundError');
// const InternalServerError = require('../errors/InternalServerError');

function getUsers(req, res, next) {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    // .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
    .catch(next);
}

function getUser(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        // res.status(404).send({ message: 'Такого пользователя не существует' });
        return Promise.reject(new Error('Такого пользователя не существует'));
      }
    })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     throw new BadRequestError('Проверьте правильность введенных данных');
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  console.log('object');
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        return Promise.reject(new Error('Такого пользователя не существует'));
      }
    })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     res.status(400).send({ message: 'Проверьте правильность введенных данных' });
    //     return;
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send({ data: user }))
    // .catch((err) => {
    //   if (err.name === 'ValidationError' || err.keyValue.email) {
    //     res.status(400).send({ message: 'Проверьте правильность введенных данных' });
    //     return;
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch(next);
}

function updateProfile(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        return Promise.reject(new Error('Такого пользователя не существует'));
      }
    })
    // .catch((err) => {
    //   if (err.name === 'CastError' || err.name === 'ValidationError') {
    //     res.status(400).send({ message: 'Проверьте правильность введенных данных' });
    //     return;
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch(next);
}

function updateAvatar(req, res, next) {
  if (req.body.avatar) {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
      new: true, runValidators: true,
    })
      .then((user) => {
        if (user) {
          res.status(200).send({ data: user });
        } else {
          return Promise.reject(new Error('Такого пользователя не существует'));
        }
      })
      // .catch((err) => {
      //   if (err.name === 'CastError' || err.name === 'ValidationError') {
      //     res.status(400).send({ message: 'Проверьте правильность введенных данных' });
      //     return;
      //   }
      //   res.status(500).send({ message: 'На сервере произошла ошибка' });
      // });
      .catch(next);
  } else {
    // res.status(400).send({ message: 'Проверьте правильность введенных данных' });
    next(new Error('Проверьте правильность введенных данных'));
  }
}

function login(req, res, next) {
  let enteringUser;
  User.findOne({ email: req.body.email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      enteringUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      const { JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: enteringUser._id }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).status(200).send({ _id: enteringUser._id });
    })
    // .catch((err) => {
    //   if (err.message === 'Неправильные почта или пароль') {
    //     res.status(401).send({ message: err.message });
    //     return;
    //   }
    //   res.status(500).send({ message: 'На сервере произошла ошибка' });
    // });
    .catch(next);
}

module.exports = {
  getUsers, createUser, getUser, getCurrentUser, updateProfile, updateAvatar, login,
};

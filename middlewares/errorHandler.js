/* eslint-disable no-unused-vars */
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const InternalServerError = require('../errors/InternalServerError');

function errorHandler(err, req, res, next) {
  function checkError(e) {
    if (e.name === 'CastError' || e.message === 'Validation failed' || e.message === 'Проверьте правильность введенных данных') {
      return new BadRequestError('Проверьте правильность введенных данных');
    }
    if (e.message === 'Неправильные почта или пароль' || e.message === 'Необходима авторизация') {
      return new UnauthorizedError(e.message);
    }
    if (e.message === 'Вы не можете удалить эту карточку') {
      return new ForbiddenError('Вы не можете удалить эту карточку');
    }
    if (e.message === 'Такой карточки не существует' || e.message === 'Такого пользователя не существует' || e.message === 'Такой страницы не существует') {
      return new NotFoundError(e.message);
    }
    if (err.code === 11000) {
      return new ConflictError('Пользователь с такой почтой уже существует');
    }
    return new InternalServerError('На сервере произошла ошибка');
  }

  const error = checkError(err);

  res.status(error.statusCode).send({ message: error.message });
}

module.exports = errorHandler;

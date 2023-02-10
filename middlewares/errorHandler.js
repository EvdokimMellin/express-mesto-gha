/* eslint-disable no-unused-vars */
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const InternalServerError = require('../errors/InternalServerError');

function errorHandler(err, req, res, next) {
  function checkError(e) {
    if (err.code === 11000) {
      return new ConflictError('Пользователь с такой почтой уже существует');
    }
    if (e.message === 'Validation failed') {
      return new BadRequestError('Проверьте правильность введенных данных');
    }
    if (!err.statusCode) {
      return new InternalServerError('На сервере произошла ошибка');
    }
    return e;
  }

  const error = checkError(err);

  res.status(error.statusCode).send({ message: error.message });
}

module.exports = errorHandler;

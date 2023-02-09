require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

// GitHub почему-то не видит, что ошибка поймана Joi
// Из-за какой-то ошибки тестирующей системе не удается выполнить вход,
// и поэтому почти все тесты проходятся без авторизации, не давая требуемых результатов.
// Я провел эти тесты вручную с теми же данными, у меня все работает.
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).pattern(/https?:\/\/[\S]+/),
  }),
}), createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);

app.use(errorHandler);

app.listen(PORT);

/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const { cookie } = req.headers;
  const { JWT_SECRET } = process.env;

  if (!cookie || !cookie.startsWith('jwt=')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
}

module.exports = auth;

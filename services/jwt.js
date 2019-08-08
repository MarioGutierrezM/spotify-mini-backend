'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');

exports.createToken = (user) => {
  const secretKey = 'secret_key';
  const { _id, name, surname, email, role, image } = user;
  const payload = {
    sub: _id,
    name,
    surname,
    email,
    role,
    image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix() // expiration date
  }

  return jwt.encode(payload, secretKey);
};

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'secret_key';

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ error: "You must have auth header" });
  }

  const token = req.headers.authorization.replace(/['"]+/g, ''); // remove '' and ""

  try {
    const payload = jwt.decode(token, secretKey);
    if (payload.exp <= moment.unix()) {
      return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload;
    next();
  
  } catch (e) {
    return res.status(404).send({ error: 'Invalid token', message: e });
  }


};
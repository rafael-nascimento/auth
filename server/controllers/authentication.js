const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

const tokenForUser = user => {
  const timeStamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret)
};

exports.signin = (req, res, next) => {
  res.status(200).send({ token: tokenForUser(req.user) });
}

exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  if ( !email || !password ) {
    return res.status(422).send({ message: 'Must send an email and a password!' });
  }

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) { return next(err) }

    if (existingUser) {
      return res.status(409).send({ message: 'User already exists!' });
    }

    const user = new User({
      email,
      password
    })

    user.save(err => {
      if (err) { return next(err); }

      res.status(201).send({ token: tokenForUser(user) });
    });
  });
};
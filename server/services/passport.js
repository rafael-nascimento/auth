const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {
  //We're telling this strategy to search for email field. If we don't do this, the library will look automatically for a "username" field.
  usernameField: 'email',
}
const localLogin = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    user.comparePasswords(password, (err, isMatch) => {
      if (err) {
        return done(err)
      }

      if (!isMatch) {
        return done(null, false);
      }

      done(null, user);
    });

    //compare user's password with password supplied by the request.
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if(err) {
      return done(err, false);
    }

    if(user) {
      done(null, user);
    } else {
      //No error, but no user found.
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');

module.exports = {

  login: (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      sails.log.info({ user });
      if (user.isApproved) {
        if (err || !user) {
          return res.send({ user });
        }
        req.logIn(user, (error) => {
          if (error) {
            return res.send(error);
          }
          return res.send({ info, user });
        });
      } else {
        return res.json("User is not approved.");
      }
    })(req, res);
  },

  logout: (req, res) => {
    req.logout();
    return res.redirect('/');
  },

};

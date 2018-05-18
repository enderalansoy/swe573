/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');

module.exports = {

  login: async (req, res) => {
    console.log(req.allParams().mail);
    passport.authenticate('local', async (err, user, info) => {
      if (!user) {
        const newUser = await User.create({
          mail: req.allParams().mail,
          password: req.allParams().password,
        }).fetch();
        res.cookie('verificationmail', newUser.mail);
        return res.view('pages/homepage', { user: newUser, info });
      }
      sails.log.info({ user });
      if (user.isApproved) {
        if (err || !user) {
          return res.send({ user });
        }
        req.logIn(user, (error) => {
          if (error) {
            return res.send(error);
          }
          res.cookie('id', user.id);
          res.cookie('mail', user.mail);
          return res.view('pages/homepage', { user, info });
        });
      } else {
        return res.json("User is not approved.");
      }
    })(req, res);
  },

  logout: (req, res) => {
    req.logout();
    res.clearCookie('mail');
    res.clearCookie('id');
    return res.redirect('/');
  },

};

const passport = require('passport');
const bcrypt =  require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ id }, (err, user) => {
    cb(err,user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'mail',
  passwordField: 'password'
}, (mail, password, cb) => {
  User.findOne({ mail }, (err, user) => {
    if(err) {
      return cb(err);
    }
    if(!user) {
      return cb(null, false, {message: 'E-mail not found'});
    }
    bcrypt.compare(password, user.password, (err, res)=> {
      if(err) {
        return res.json(err);
      }
      if(!res) {
        return cb(null, false, {message: 'Invalid Password'});
      }
      let userDetails = {
        mail: user.mail,
        id: user.id,
        isApproved: user.isApproved,
      };
      return cb(null, userDetails, {message: 'Login Successful'});
    });
  });
}));
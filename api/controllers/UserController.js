/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodeMailer = require('nodemailer');

module.exports = {

  approve: async (req, res) => {
    let user = await User.findOne({ mail: req.query.mail });
    console.log(user);
    if (req.query.secret === user.mailSecret) {
      console.log(true);
      const updatedUser = await User.update({ mail: req.query.mail }).set({ isApproved: true}).fetch();
      res.clearCookie('verificationmail');
      res.cookie('id', updatedUser[0].id);
      return res.redirect('/');
    } else {
      return res.json('Wrong secret.');
    }
  },

  resend: async (req, res) => {
    if (typeof req.query.mail === 'undefined') {
      return res.json('Please enter mail.');
    }
    const chars = '0123456789';
    let secret = '';
    for (let i = 5; i > 0; i -= 1) {
      secret += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    const user = await User.update({ mail: req.query.mail }).set({ mailSecret: secret}).fetch();
    if (user[0].isApproved === true) {
      return res.json('User has already been approved');
    }
    let transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: sails.config.secrets.gmail.user,
        pass: sails.config.secrets.gmail.pass,
      }
    });
    let mailOptions = {
      from: sails.config.secrets.gmail.user, // sender address
      to: user[0].mail, // list of receivers
      subject: 'Mail verification', // Subject line
      html: `
        Your code is: <b>${user[0].mailSecret}</b>
        You can enter the code in the application or 
        <a href=/approve?mail=${user[0].mail}&secret=${user[0].mailSecret}>click here</a>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log(info);
      return res.json('mail has been resent');
    });
  },

  clear: async (req, res) => {
    await User.destroy({});
    return res.send('All users have been deleted.');
  },

  getfavorites: async (req, res) => {
    const user = await User.findOne({ id: req.query.id });
    return res.json(user.favorites);
  },

  setfavorites: async (req, res) => {
    let favorites = req.query.favorites;
    favorites = favorites.split(',');
    const user = await User.update({ id: req.query.id }).set({ favorites }).fetch();
    return res.json(user.favorites);
  },
};


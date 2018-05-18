/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt-nodejs');
const nodeMailer = require('nodemailer');

module.exports = {

  attributes: {

    mail: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
    },

    password: {
      type: 'string',
      required: true,
      protect: true,
      custom: (value) => {
        return _.isString(value) && value.length >= 8
          && value.match(/[a-z]/i)
          && value.match(/[0-9]/);
      },
    },

    isApproved: {
      type: 'boolean',
      defaultsTo: false,
    },

    mailSecret: {
      type: 'string',
      defaultsTo: 'no-secret',
    },

  },

  customToJSON: function() {
    // Omit password from listing
    return _.omit(this, ['mailSecret', 'password']);
  },

  beforeCreate: async(user, callback) => {

    // Password hash generator:
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;

    // Mail verification secret generator:
    const chars = '0123456789';
    let secret = '';
    for (let i = 5; i > 0; i -= 1) {
      secret += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    user.mailSecret = secret;

    // Send verification mail:
    let transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: sails.config.secrets.gmail.user,
        pass: sails.config.secrets.gmail.password,
      },
    });

    // Options of verification mail:
    let mailOptions = {
      from: sails.config.secrets.gmail.user, // sender address
      to: user.mail, // list of receivers
      subject: 'Mail verification', // Subject line
      html: `
        Your code is: <b>${user.mailSecret}</b>
        You can enter the code in the application or 
        <a href=/approve?mail=${user.mail}&secret=${user.mailSecret}>click here</a>
      `
    };

    // Sending the mail:
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log(info);
      return callback();
    });

  }

};


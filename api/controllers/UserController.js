/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  approve: async (req, res) => {
    let user = await User.findOne({ mail: req.query.mail });
    console.log(user);
    if (req.query.secret === user.mailSecret) {
      console.log(true);
      const updatedUser = await User.update({ mail: req.query.mail }).set({ isApproved: true}).fetch();
      return res.json(updatedUser);
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
        user: 'aendersoy@gmail.com',
        pass: 'Iop890778'
      }
    });

    let mailOptions = {
      from: 'aendersoy@gmail.com', // sender address
      to: user[0].mail, // list of receivers
      subject: 'Mail verification', // Subject line
      html: `
        Your code is: <b>${user[0].mailSecret}</b>
        You can enter the code in the application or 
        <a href=https://fobenchmark.com/approve?mail=${user[0].mail}&secret=${user[0].mailSecret}>click here</a>
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
    

};


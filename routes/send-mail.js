const router = require('express').Router()
const authCtrl = require('../controllers/auth')
var nodemailer = require('nodemailer');

router.post('/', (req, res) => {
  const {email, content} = req.body
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'phamvantai22027@gmail.com',
      pass: 'bpzfyqonqdcbxnqd'
    }
  });

  var mailOptions = {
    from: 'phamvantai22027@gmail.com',
    to: email,
    subject: 'Sending Email using Node.js',
    html: `${content}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ msg:'ok'})
    }
  });
})

module.exports = router
import express from 'express';
import nodemailer from'nodemailer'

const router = express.Router();
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


export default  router;
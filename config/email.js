var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  // service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    // user: 'yeppeneshop@gmail.com',
    // pass: 'vxpdlzbflsmrucup'
    user: 'irwan9102@gmail.com',
    pass: 'nmurvtwmdrpthvjm'
  }
});

module.exports = transporter;

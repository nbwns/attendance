const nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    host: 'smtp.brufor.be',
    port: 25
});

module.exports = { smtpTransport};
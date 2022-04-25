const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "bbfd49a362070c",
    pass: "40af911cf2083a",
  },
});

module.exports = transport;

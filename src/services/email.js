const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  auth: {
    user: "noreply@twittcloneteamone.xyz",
    pass: "twittercloneemailHost",
  },
});

module.exports = transport;

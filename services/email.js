const nodemailer = require("nodemailer");

function sendEmail({ from, to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const info = transporter.sendMail({
    from: `iShare <${from}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
}

module.exports = sendEmail;

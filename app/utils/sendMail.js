const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
function sendEmail(to, subject, text) {
  console.log(to, subject, text);
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject({ error: true, message: error });
      } else {
        console.log("Email sent: " + info.response);
        resolve({ error: false, message: "Email sent: " + info.response });
      }
    });
  });
}

module.exports = sendEmail;

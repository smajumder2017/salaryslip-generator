const nodemailer = require("nodemailer");
const config = require("../config");

function sendEmailWithAttachment(
  to,
  subject,
  text,
  attachmentPath,
  attachmentFilename
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "ohhshawarma@gmail.com",
    to: to,
    subject: subject,
    html: text,
    attachments: [
      {
        filename: attachmentFilename,
        path: attachmentPath,
      },
    ],
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = {
  sendEmailWithAttachment,
};

// Example usage
// sendEmailWithAttachment(
//   'recipient_email@example.com',
//   'Email with Attachment',
//   'This is an email with an attachment.',
//   'path/to/your/attachment.txt',
//   'attachment.txt'
// )
//   .then(info => {
//     console.log('Email sent: ' + info.response);
//   })
//   .catch(error => {
//     console.error(error);
//   });

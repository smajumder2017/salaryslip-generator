const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};

const nodemailer = require('nodemailer');

// Create a transporter using SMTP transport for Outlook
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com', // Outlook SMTP server
  port: 587, // Port for secure TLS
  secure: false, // Use TLS
  auth: {
    user: 'fitsync.react@outlook.com', // Your Outlook email address
    pass: 'Fitsync1', // Your Outlook password
  },
});

module.exports = transporter;

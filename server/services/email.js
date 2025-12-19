const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// Send confirmation email after registration
const sendConfirmationEmail = (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Registration Successful',
    text: 'Welcome to E-Banking Tech! Your registration was successful. You can now login using your credentials.'
  };

  return transporter.sendMail(mailOptions);
};

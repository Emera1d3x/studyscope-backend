import nodemailer from 'nodemailer';

export async function emailParentForgotPassword(to, resetLink, name) {
  const transporter = nodemailer.createTransport({
    service: 'smtp.titan.email',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"StudyScope" <info@studyscopetutoring.com>',
    to,
    subject: 'Reset Your Password - StudyScope Tutoring',
    html: `<div>Hello ${name}, reset your parent account password <a href="${resetLink}">here</a>.</div>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Parent Email sent: ', info.response);
  } catch (error) {
    console.error('Parent Email failed:', error);
  }
}

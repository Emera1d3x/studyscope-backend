import nodemailer from 'nodemailer';

export async function emailParentVerify(to, code) {
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
    subject: 'Verify Your Email - StudyScope Tutoring',
    html: `<div>Hello! Your verification code is <b>${code}</b>. Please enter this code to verify your parent account.</div>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Parent verification email sent: ', info.response);
  } catch (error) {
    console.error('Parent verification email failed:', error);
  }
}

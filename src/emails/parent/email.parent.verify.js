import nodemailer from 'nodemailer';

export async function emailParentVerify(to, name, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"StudyScope" <info@studyscopetutoring.com>',
    to,
    subject: 'Verify Your Email - StudyScope Tutoring',
    html: `
  <div style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="width: 100%; background-color: #eef4f9; padding: 40px 0;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #ced3f1;">
        <div style="background-color: #ffffff; padding: 30px 40px 10px 40px; text-align: center;">
          <img src="https://studyscopetutoring.com/assets/images/Email_StudyScopeLogo2.png" alt="StudyScope Logo" style="height: 105px;" />
          <h2 style="color: #1e1e2d; margin-bottom: 10px; margin-top: 0;">Verify Your Email</h2>
          <p style="color: #6d6d76; font-size: 16px; line-height: 1.5;">
            Hello ${name}! You are almost finished creating your new StudyScope <b style="color: white; background-color: #83838a; padding: 4px 8px; border-radius: 5px; margin:02px;">parent</b> account! To finish this process please click the button below and verify your email.
          </p>
          <a href="https://localhost:5000/parent/verify?email=${to}&code=${code}" style="display: inline-block; background: radial-gradient(100% 100% at 50% 0%, #a225eb 0%, #4319db 100%); color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 5px; font-size: 16px;">
            Verify Email
          </a>
          <p style="color: #6d6d76; font-size: 16px; line-height: 1.5;">
            After success, you may <a target="_blank" href="https://studyscopetutoring.com/parent/login">login</a>!
          </p>
          <p style="margin-top: 30px; color: #999; font-size: 13px; line-height: 1.4;">
            If you didn’t request this, you can safely ignore this email.<br />
            This link will expire in 1 hour.
          </p>
        </div>
        <div style="background-color: #edeef2; padding: 20px 40px; text-align: center; font-size: 12px; color: #a0a4ab;">
          <p style="margin: 0;">Need help? Contact us at <a href="mailto:support@napkin.com" style="color: #6f0789; text-decoration: underline;">support@studyscopetutoring.com</a></p>
          <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} StudyScope Tutoring. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Parent verification email sent: ', info.response);
  } catch (error) {
    console.error('Parent verification email failed:', error);
  }
}

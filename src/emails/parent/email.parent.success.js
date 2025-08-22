import nodemailer from 'nodemailer';

export async function emailParentSuccess(to, name) {
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
    subject: 'Welcome - StudyScope Tutoring',
    html: `
  <div style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="width: 100%; background-color: #eef4f9; padding: 40px 0;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #ced3f1;">
        <div style="background-color: #ffffff; padding: 30px 40px 10px 40px; text-align: center;">
          <img src="https://studyscopetutoring.com/assets/images/Email_Welcome.png" alt="Welcome To StudyScope Tutoring!" style="width: 100%;" />
          <h2 style="color: #1e1e2d; margin-bottom: 10px; margin-top: 0;">Account Created!</h2>
          <p style="color: #6d6d76; font-size: 16px; line-height: 1.5;">
            Congratulations! 🎉 You’ve successfully created your Parent StudyScope Tutoring account! We’re thrilled to have you join our community.
          </p>
          <a href="https://crazycattle3d.github.io/" style="display: inline-block; background: radial-gradient(100% 100% at 50% 0%, #a225eb 0%, #4319db 100%); color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 5px; font-size: 16px;">
            Check Out Programs
          </a>
          <p style="color: #6d6d76; font-size: 16px; line-height: 1.5;">
              <span style="font-weight: bolder;">🌟 Explore Our Programs </span><br>
              Take a moment to check out our programs and discover the perfect fit for your child. Whether it’s building strong foundations or advancing skills, we’re here to support every step of the way.
              We’re excited to work with you and watch your child thrive! 💡📚
          </p>
          <img src="https://studyscopetutoring.com/assets/images/Email_StudyScopeLogo2.png" alt="StudyScope Logo" style="width: 30%; padding: 0; margin: 0;" >
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
    console.log('Parent Email sent: ', info.response);
  } catch (error) {
    console.error('Parent Email failed:', error);
  }
}

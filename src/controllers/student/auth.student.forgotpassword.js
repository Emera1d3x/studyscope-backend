import { StudentModel } from '../../models/model.user.js';
import { emailStudentForgotPassword } from '../../emails/student/email.student.forgotpassword.js';

export async function forgotStudentPassword(req, res) {
  try {
    const emailInput = req.body.email;
    if (!emailInput || !emailInput.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const student = await StudentModel.findOne({ email: emailInput });
    if (!student) {
      return res.status(400).json({ error: 'Email not found' });
    }
    const resetToken = resetPasswordTokenGenerator(12);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    student.resetPasswordToken = resetToken;
    student.resetPasswordExpiresAt = expiresAt;
    await student.save();
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await emailStudentForgotPassword(student.email, resetLink, student.name);
    console.log(`Password Reset Link for ${student.email}: ${resetLink}`);
    res.json('Success:ResetLinkSent');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function resetPasswordTokenGenerator(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

import { StudentModel } from '../../models/model.user.js';
import { emailStudentForgotPassword } from '../../emails/student/email.student.forgotpassword.js';

export async function forgotStudentPassword(req, res) {
  const emailInput = req.body.email;
  if (!emailInput || !emailInput.includes('@')) {
    res.json('Fail:InvalidEmail'); return;
  }
  const student = await StudentModel.findOne({ email: emailInput });
  if (!student) {
    res.json('Fail:EmailNotFound'); return;
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

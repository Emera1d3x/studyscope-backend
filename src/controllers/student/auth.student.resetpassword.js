import { StudentModel } from '../../models/model.user.js';

export async function resetStudentPassword(req, res) {
  const tokenInput = req.body.token;
  const newPasswordInput = req.body.password;
  if (!tokenInput || !newPasswordInput) {
    res.json('Fail:MissingFields'); return;
  }
  if (newPasswordInput.length <= 4) {res.json('Fail:PasswordShort'); return;} 
  if (newPasswordInput.length > 20) {res.json('Fail:PasswordLong'); return;}
  const student = await StudentModel.findOne({
    resetPasswordToken: tokenInput,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });
  if (!student) {res.json('Fail:InvalidOrExpiredToken');return;}
  student.password = newPasswordInput;
  student.resetPasswordToken = undefined;
  student.resetPasswordExpiresAt = undefined;
  await student.save();
  res.json('Success:PasswordReset');
}

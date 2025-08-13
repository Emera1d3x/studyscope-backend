import { StudentModel } from '../../models/model.user.js';

export async function resetStudentPassword(req, res) {
  try {
    const tokenInput = req.body.token;
    const newPasswordInput = req.body.password;
    if (!tokenInput || !newPasswordInput) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (newPasswordInput.length <= 4) {return res.status(400).json({ error: 'Password too short' });}
    if (newPasswordInput.length > 20) {return res.status(400).json({ error: 'Password too long' });}
    const student = await StudentModel.findOne({
      resetPasswordToken: tokenInput,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!student) {return res.status(400).json({ error: 'Invalid or expired token' });}
    student.password = newPasswordInput;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpiresAt = undefined;
    await student.save();
    res.json('Success:PasswordReset');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

import { ParentModel } from '../../models/model.user.js';

export async function resetParentPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (newPassword.length <= 4) {return res.status(400).json({ error: 'Password too short' });}
    if (newPassword.length > 20) {return res.status(400).json({ error: 'Password too long' });}
    const parent = await ParentModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!parent) {return res.status(400).json({ error: 'Invalid or expired token' });}
    parent.password = newPassword;
    parent.resetPasswordToken = undefined;
    parent.resetPasswordExpiresAt = undefined;
    await parent.save();
    res.json('Success:PasswordReset');
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

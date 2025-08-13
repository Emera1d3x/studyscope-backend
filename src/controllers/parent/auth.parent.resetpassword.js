import { ParentModel } from '../../models/model.user.js';

export async function resetParentPassword(req, res) {
  try {
    const tokenInput = req.body.token;
    const newPasswordInput = req.body.password;
    if (!tokenInput || !newPasswordInput) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (newPasswordInput.length <= 4) {return res.status(400).json({ error: 'Password too short' });}
    if (newPasswordInput.length > 20) {return res.status(400).json({ error: 'Password too long' });}
    const parent = await ParentModel.findOne({
      resetPasswordToken: tokenInput,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!parent) {return res.status(400).json({ error: 'Invalid or expired token' });}
    parent.password = newPasswordInput;
    parent.resetPasswordToken = undefined;
    parent.resetPasswordExpiresAt = undefined;
    await parent.save();
    res.json('Success:PasswordReset');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

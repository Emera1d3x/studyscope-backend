import { ParentModel } from '../../models/model.user.js';

export async function resetParentPassword(req, res) {
  const tokenInput = req.body.token;
  const newPasswordInput = req.body.password;
  if (!tokenInput || !newPasswordInput) {
    res.json('Fail:MissingFields'); return;
  }
  if (newPasswordInput.length <= 4) {res.json('Fail:PasswordShort'); return;} 
  if (newPasswordInput.length > 20) {res.json('Fail:PasswordLong'); return;}
  const parent = await ParentModel.findOne({
    resetPasswordToken: tokenInput,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });
  if (!parent) {res.json('Fail:InvalidOrExpiredToken');return;}
  parent.password = newPasswordInput;
  parent.resetPasswordToken = undefined;
  parent.resetPasswordExpiresAt = undefined;
  await parent.save();
  res.json('Success:PasswordReset');
}

import { ParentModel } from '../../models/model.user.js';
import { emailParentForgotPassword } from '../../emails/parent/email.parent.forgotpassword.js';

export async function forgotParentPassword(req, res) {
  const emailInput = req.body.email;
  if (!emailInput || !emailInput.includes('@')) {
    res.json('Fail:InvalidEmail'); return;
  }
  const parent = await ParentModel.findOne({ email: emailInput });
  if (!parent) {
    res.json('Fail:EmailNotFound'); return;
  }
  const resetToken = resetPasswordTokenGenerator(12);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  parent.resetPasswordToken = resetToken;
  parent.resetPasswordExpiresAt = expiresAt;
  await parent.save();
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  await emailParentForgotPassword(parent.email, resetLink, parent.name);
  console.log(`Password Reset Link for ${parent.email}: ${resetLink}`);
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

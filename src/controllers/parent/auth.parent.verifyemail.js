import { ParentModel } from '../../models/model.user.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import { generateAccessToken, generateRefreshToken } from '../../generators/generator.token.js';

export async function verifyParentEmail(req, res) {
  const codeInput = req.body.code;
  const emailInput = req.body.email;
  if (!codeInput || !emailInput) {
    res.json('Fail:MissingFields'); return;
  }
  const parent = await ParentModel.findOne({
    email: emailInput,
    verificationToken: codeInput,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });
  if (!parent) {res.json('Fail:InvalidOrExpiredToken'); return;}
  parent.emailVerified = true;
  parent.verificationToken = undefined;
  parent.verificationTokenExpiresAt = undefined;
  await parent.save();
  console.log(`Parent ${parent.email} Email verified`);
  const accessToken = generateAccessToken(parent._id);
  const refreshToken = generateRefreshToken(parent);
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await new RefreshToken({ user: parent._id, token: refreshToken, expiry }).save();
  res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json('Success:EmailVerified');
}

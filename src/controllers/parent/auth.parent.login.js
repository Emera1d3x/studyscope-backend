import { ParentModel } from '../../models/model.user.js';
import { verifyGoogleIdTokenHelper } from '../../middleware/verify.google.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import { generateAccessToken, generateRefreshToken } from '../../generators/generator.token.js';

export async function loginParent(req, res) {
  try {
    const { loginMethod, email, password, googleSecret } = req.body;
    if (!loginMethod || !email || email.trim() === '') {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const parent = await ParentModel.findOne({ email });
    if (!parent) return res.status(400).json({ error: 'Email not found' });
    if (parent.loginMethod !== loginMethod) {
      return res.status(400).json({ error: 'Login method mismatch' });
    }

    if (loginMethod === 'email') {
      if (!password || password.trim() === '') {
        return res.status(400).json({ error: 'Missing password' });
      }
      if (parent.password !== password) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
      if (!parent.emailVerified) {
        const verificationTokenSecret = Math.floor(100000 + Math.random() * 900000);
        parent.verificationToken = verificationTokenSecret;
        parent.verificationTokenExpiresAt = new Date(Date.now() + 24*60*60*1000);
        await parent.save();
        return res.status(400).json({ error: 'Email not verified' });
      }
    }
    else if (loginMethod === 'google') {
      if (!googleSecret) {
        return res.status(400).json({ error: 'Missing Google token' });
      }
      const payload = await verifyGoogleIdTokenHelper(googleSecret);
      if (!payload) return res.status(400).json({ error: 'Google authentication failed' });
      if (payload.email !== parent.email) {
        return res.status(400).json({ error: 'Google email mismatch' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid login method' });
    }
    const accessToken = generateAccessToken(parent._id);
    const refreshToken = generateRefreshToken(parent);
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await new RefreshToken({ userId: parent._id, token: refreshToken, expiresAt: expiry }).save();
    const oldRefreshToken = req.cookies?.refreshToken;
    if (oldRefreshToken) {
      await RefreshToken.deleteOne({ token: oldRefreshToken });
    }
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
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
      .json('Success');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

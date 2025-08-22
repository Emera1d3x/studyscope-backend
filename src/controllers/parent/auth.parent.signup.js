import { ParentModel } from '../../models/model.user.js';
import { verifyGoogleIdTokenHelper } from '../../middleware/verify.google.js';
import { emailParentVerify } from '../../emails/parent/email.parent.verify.js';
import { emailParentSuccess } from '../../emails/parent/email.parent.success.js';

export async function signupParent(req, res) {
  try {
    const { loginMethod, name, email, password, googleSecret } = req.body;
    if (loginMethod === 'email') {
      if (!name || !email || !password || name.trim() === '' || email.trim() === '' || password.trim() === '') {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      if (!email.includes('@')) {return res.status(400).json({ error: 'Invalid email' });}
      if (password.length < 5) {return res.status(400).json({ error: 'Password too short' });}
      if (password.length > 20) {return res.status(400).json({ error: 'Password too long' });}
      const existingParent = await ParentModel.findOne({ email: email });
      if (existingParent) {
        if (existingParent.emailVerified) {return res.status(400).json({ error: 'Parent Email Already Used' });}
        else {await existingParent.deleteOne();}
      }
      const verificationTokenSecret = Math.floor(100000 + Math.random() * 900000);
      const parent = new ParentModel({
        name: name,
        email: email,
        password: password,
        loginMethod: 'email',
        emailVerified: false,
        verificationToken: verificationTokenSecret,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      await parent.save();
      await emailParentVerify(parent.email, parent.name, verificationTokenSecret);
      return res.json('Success:VerificationSent');
    } else if (loginMethod === 'google') {
      if (!googleSecret) return res.status(400).json({ error: 'Missing Google token' });
      const payload = await verifyGoogleIdTokenHelper(googleSecret);
      if (!payload) return res.status(400).json({ error: 'Google auth failed' });
      const existingParent = await ParentModel.findOne({ email: payload.email });
      if (existingParent) {
        if (existingParent.emailVerified) {
          return res.status(400).json({ error: 'Email already exists' });
        } else {
          await existingParent.deleteOne();
        }
      }
      const parent = new ParentModel({
        name: payload.name,
        email: payload.email,
        loginMethod: 'google',
        emailVerified: true,
      });
      await parent.save();
      await emailParentSuccess(parent.email);
      return res.json('Success:AccountCreated');
    } else {
      return res.status(400).json({ error: 'Invalid login method' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

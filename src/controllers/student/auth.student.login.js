import { StudentModel } from '../../models/model.user.js';
import { verifyGoogleIdToken } from '../../middleware/verify.google.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import { generateAccessToken, generateRefreshToken } from '../../generators/generator.token.js';

export async function loginStudent(req, res) {
  try {
    const loginMethodInput = req.body.loginMethod;
    const emailInput = req.body.email;
    const passwordInput = req.body.password;
    if (!loginMethodInput || !emailInput || !passwordInput || emailInput.trim() === '' || passwordInput.trim() === '') {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!emailInput.includes('@')) {return res.status(400).json({ error: 'Invalid email' });}
    const student = await StudentModel.findOne({ email: emailInput });
    if (!student) {return res.status(400).json({ error: 'Email not found' });}
    if (student.loginMethod !== loginMethodInput) {return res.status(400).json({ error: 'Login method mismatch' });}
    if (student.password !== passwordInput) {return res.status(400).json({ error: 'Incorrect password' });}
    if (!student.emailVerified) {
      const verificationTokenSecret = Math.floor(100000 + Math.random() * 900000);
      student.verificationToken = verificationTokenSecret;
      await student.save();
      return res.status(400).json({ error: 'Email not verified' });
    }
    const accessToken = generateAccessToken(student._id);
    const refreshToken = generateRefreshToken(student);
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await new RefreshToken({ user: student._id, token: refreshToken, expiry }).save();
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
      .json('Success');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

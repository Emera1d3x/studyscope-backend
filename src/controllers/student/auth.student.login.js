import { StudentModel } from '../../models/model.user.js';
import { verifyGoogleIdToken } from '../../middleware/verify.google.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import { generateAccessToken, generateRefreshToken } from '../../generators/generator.token.js';

export async function loginStudent(req, res) {
  const loginMethodInput = req.body.loginMethod;
  const emailInput = req.body.email;
  const passwordInput = req.body.password;
  if (!emailInput || emailInput.trim() === '' || !passwordInput || passwordInput.trim() === '') {res.json('Fail:MissingFields'); return;}
  if (!emailInput.includes('@')) {res.json('Fail:InvalidEmail'); return;}
  const student = await StudentModel.findOne({ email: emailInput });
  if (!student) {res.json('Fail:EmailNotFound'); return;}
  if (student.loginMethod !== loginMethodInput) {res.json('Fail:LoginMethodMismatch'); return;}
  if (student.password !== passwordInput) {res.json('Fail:Password'); return;}
  if (!student.emailVerified) {
    const verificationTokenSecret = Math.floor(100000 + Math.random() * 900000);
    student.verificationToken = verificationTokenSecret;
    await student.save();
    res.json('Fail:EmailNotVerified'); return;
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
}

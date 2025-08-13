import { ParentModel, StudentModel } from '../../models/model.user.js';
import { verifyGoogleIdToken } from '../../middleware/verify.google.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import { generateAccessToken, generateRefreshToken } from '../../generators/generator.token.js';
import { emailParentVerify } from '../../emails/parent/email.parent.verify.js';

export async function signupParent(req, res) {
  try {
    const loginMethodInput = req.body.loginMethod;
    if (!loginMethodInput) {
      return res.status(400).json({ error: 'Missing loginMethod' });
    }
    if (loginMethodInput === 'email') {
      const nameInput = req.body.name;
      const emailInput = req.body.email;
      const passwordInput = req.body.password;
      const studentName = req.body.studentName;
      const studentEmail = req.body.studentEmail;
      if (!nameInput || !emailInput || !passwordInput || !studentName || !studentEmail || nameInput.trim() === '' || emailInput.trim() === '' || passwordInput.trim() === '' || studentName.trim() === '' || studentEmail.trim() === '') {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      if (!emailInput.includes('@') || !studentEmail.includes('@')) {return res.status(400).json({ error: 'Invalid email' });}
      if (passwordInput.length <= 4) {return res.status(400).json({ error: 'Password too short' });}
      if (passwordInput.length > 20) {return res.status(400).json({ error: 'Password too long' });}
      const existingParent = await ParentModel.findOne({ email: emailInput });
      if (existingParent) {
        if (existingParent.emailVerified) {return res.status(400).json({ error: 'Email already exists' });}
        else {await existingParent.deleteOne();}
      }
      const verificationTokenSecret = Math.floor(100000 + Math.random() * 900000);
      const parent = new ParentModel({
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        loginMethod: 'email',
        emailVerified: false,
        verificationToken: verificationTokenSecret,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      await parent.save();
      const student = new StudentModel({
        name: studentName,
        email: studentEmail,
        parentId: parent._id,
        loginMethod: 'email',
        emailVerified: false
      });
      await student.save();
      await emailParentVerify(parent.email, verificationTokenSecret);
      return res.json('Success:ParentAndStudentCreated_VerificationSent');
    } else if (loginMethodInput === 'google') {
      const nameInput = req.body.name;
      const emailInput = req.body.email;
      const googleSecretInput = req.body.googleSecret;
      const studentName = req.body.studentName;
      const studentEmail = req.body.studentEmail;
      if (!emailInput || emailInput.trim() === '' || !emailInput.includes('@') || !studentName || !studentEmail || studentName.trim() === '' || studentEmail.trim() === '' || !studentEmail.includes('@')) {
        return res.status(400).json({ error: 'Invalid email or missing fields' });
      }
      const existingParent = await ParentModel.findOne({ email: emailInput });
      if (existingParent) {return res.status(400).json({ error: 'Email already exists' });}
      const fromGoogle = await verifyGoogleIdToken(req, res);
      if (!fromGoogle) {return res.status(400).json({ error: 'Google auth failed' });}
      const verificationTokenSecret = Math.floor(100000 + Math.random() * 900000);
      const parent = new ParentModel({
        name: nameInput,
        email: emailInput,
        password: '12345',
        loginMethod: 'google',
        emailVerified: false,
        verificationToken: verificationTokenSecret,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      await parent.save();
      const student = new StudentModel({
        name: studentName,
        email: studentEmail,
        parentId: parent._id,
        loginMethod: 'google',
        emailVerified: false
      });
      await student.save();
      await emailParentVerify(parent.email, verificationTokenSecret);
      return res.json('Success:ParentAndStudentCreated_VerificationSent');
    } else {
      return res.status(400).json({ error: 'Invalid login method' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

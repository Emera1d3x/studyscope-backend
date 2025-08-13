import { ParentModel, StudentModel } from '../../models/model.user.js';
import { verifyGoogleIdToken } from '../../middleware/verify.google.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import { generateAccessToken, generateRefreshToken } from '../../generators/generator.token.js';
import { emailParentVerify } from '../../emails/parent/email.parent.verify.js';

export async function signupParent(req, res) {
  const loginMethodInput = req.body.loginMethod;

  if (loginMethodInput === 'email') {
    const nameInput = req.body.name;
    const emailInput = req.body.email;
    const passwordInput = req.body.password;
    const studentName = req.body.studentName;
    const studentEmail = req.body.studentEmail;
    if (!nameInput || !emailInput || !passwordInput || !studentName || !studentEmail || nameInput.trim() === '' || emailInput.trim() === '' || passwordInput.trim() === '' || studentName.trim() === '' || studentEmail.trim() === '') {
      res.json('Fail:MissingFields'); return;
    }
    if (!emailInput.includes('@') || !studentEmail.includes('@')) {res.json('Fail:InvalidEmail'); return;}
    if (passwordInput.length <= 4) {res.json('Fail:PasswordShort'); return;}
    if (passwordInput.length > 20) {res.json('Fail:PasswordLong'); return;}
    const existingParent = await ParentModel.findOne({ email: emailInput });
    if (existingParent) {
      if (existingParent.emailVerified) {res.json('Fail:EmailExists'); return;}
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
    res.json('Success:ParentAndStudentCreated_VerificationSent');
    return;
  } else if (loginMethodInput === 'google') {
    const nameInput = req.body.name;
    const emailInput = req.body.email;
    const googleSecretInput = req.body.googleSecret;
    const studentName = req.body.studentName;
    const studentEmail = req.body.studentEmail;
    if (!emailInput || emailInput.trim() === '' || !emailInput.includes('@') || !studentName || !studentEmail || studentName.trim() === '' || studentEmail.trim() === '' || !studentEmail.includes('@')) {
      res.json('Fail:InvalidEmail'); return;
    }
    const existingParent = await ParentModel.findOne({ email: emailInput });
    if (existingParent) {res.json('Fail:EmailExists'); return;}
    const fromGoogle = await verifyGoogleIdToken(req, res);
    if (!fromGoogle) {res.json('Fail:GoogleAuthFail'); return;}
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
    res.json('Success:ParentAndStudentCreated_VerificationSent');
    return;
  } else {
    res.json('Fail:What?'); return;
  }
}

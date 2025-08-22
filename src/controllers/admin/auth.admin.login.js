import { AdminModel } from '../../models/model.user.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import { generateAccessToken, generateRefreshToken } from '../../generators/generator.token.js';

export async function loginAdmin(req, res) {
  try {
    const nameInput = req.body.name;
    const passwordInput = req.body.password;
    if (!nameInput || !passwordInput || nameInput.trim() === '' || passwordInput.trim() === '') {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const admin = await AdminModel.findOne({ name: nameInput });
    if (!admin) {return res.status(400).json({ error: 'Email not found' });}
    if (admin.password !== passwordInput) {return res.status(400).json({ error: 'Incorrect password' });}
    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin);
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await new RefreshToken({ userId: admin._id, token: refreshToken, expiresAt: expiry }).save();
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

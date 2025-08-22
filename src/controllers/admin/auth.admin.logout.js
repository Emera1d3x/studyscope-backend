import { AdminModel } from '../../models/model.user.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import jwt from 'jsonwebtoken';

export async function logoutAdmin(req, res) {
  try {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      res.status(400).json({ error: 'Missing refresh token' });
    }
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json('Logged out');
    await RefreshToken.deleteOne({ token: refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

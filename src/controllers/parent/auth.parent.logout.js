import { ParentModel } from '../../models/model.user.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import jwt from 'jsonwebtoken';
const refreshSecret = 'supersecretrefresh';

export async function logoutParent(req, res) {
  try {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refresh token' });
    }
    try {
      const payload = jwt.verify(refreshToken, refreshSecret);
      await RefreshToken.deleteOne({ token: refreshToken, user: payload.id });
    } catch (err) {
      console.error('Invalid refresh token during logout');
    }
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json('Logged out');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

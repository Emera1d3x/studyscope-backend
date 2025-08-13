import { StudentModel } from '../../models/model.user.js';
import RefreshToken from '../../models/refreshtoken.model.js';
import jwt from 'jsonwebtoken';
const refreshSecret = 'supersecretrefresh';

export async function logoutStudent(req, res) {
  const refreshToken = req.cookies['refreshToken'];
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, refreshSecret);
      await RefreshToken.deleteOne({ token: refreshToken, user: payload.id });
    } catch (err) {console.error('Invalid refresh token during logout');}
  }
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json('Logged out');
}

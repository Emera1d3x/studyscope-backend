import RefreshToken from '../../models/refreshtoken.model.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../generators/generator.token.js';

export async function refreshParent(req, res) {
  try {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {return res.status(401).json({ error: 'Missing refresh token' });}
    const existingToken = await RefreshToken.findOne({ token: refreshToken });
    if (!existingToken || existingToken.expiresAt <= new Date()) {return res.status(401).json({ error: 'Invalid or expired refresh token' });}
    await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {return res.status(401).json({ error: 'Invalid refresh token' });}
        const refreshInfo = decoded;
        if (refreshInfo.tokenType !== 'refresh') {return res.status(403).json({ error: 'Invalid token type' });}
        const newAccessToken = generateAccessToken(refreshInfo.id);
        res
          .cookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
            secure: false,
          })
          .json('AccessTokenRefreshed');
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

import RefreshToken from '../../models/refreshtoken.model.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../generators/generator.token.js';

export async function refreshParent(req, res) {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {res.status(401).json('RefreshTokenDNE1');return;}
  const existingToken = await RefreshToken.findOne({ token: refreshToken });
  if (!existingToken || existingToken.expiry <= new Date()) {res.status(401).json('RefreshTokenDNE');return;}

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {if (err) {res.status(401).json('InvalidRefreshToken');return;}
    const refreshInfo = decoded;
    if (refreshInfo.tokenType !== 'refresh') {res.status(403).json('InvalidTokenType');return;}
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
}

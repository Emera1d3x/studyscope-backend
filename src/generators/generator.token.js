import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpire = '15m';
const refreshExpire = '7d';

if (!accessSecret || !refreshSecret) {throw new Error("serverERROR:JWTSecretIssues");}

export function generateAccessToken(userId) {
  const payload = {id: userId, tokenType: "access"};
  const options = {expiresIn: accessExpire};
  const accessToken = jwt.sign(payload, accessSecret, options);
  return accessToken;
}

export function generateRefreshToken(user) {
  const payload = {id: user._id, tokenType: "refresh"};
  const options = {expiresIn: refreshExpire};
  const refreshToken = jwt.sign(payload, refreshSecret, options);
  return refreshToken;
}


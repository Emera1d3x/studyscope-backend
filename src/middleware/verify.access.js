export function verifyAccess(req, res, next) {
  const token = req.cookies['accessToken'];
  if (!token) {res.status(401).json("AccessTokenUnavailable"); return;}
  try {
    const payload = require('jsonwebtoken').verify(token, process.env.JWT_ACCESS_SECRET);
    if (payload.tokenType !== "access") {res.status(401).json("InvalidTokenType"); return;}
    req.userId = payload.id;
    next();
  } catch (err) {res.status(401).json("ServerAccessTokenDecryptionError");return;}
}


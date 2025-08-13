import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleIdToken(req, res) {
  const googleIdTokenInput = req.body.googleSecret;
  const emailInput = req.body.email;

  if (!googleIdTokenInput) {
    res.json('Fail:MissingGoogleIdToken');
    return false;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleIdTokenInput,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || payload.email !== emailInput) {
      res.json('Fail:GoogleTokenEmailMismatch');
      return false;
    }

    req.body.googlePayload = payload;
    return true;
  } catch (err) {
    console.error('Google token verification failed:', err);
    res.json('Fail:GoogleTokenVerificationError');
    return false;
  }
}

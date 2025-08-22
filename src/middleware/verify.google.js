import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleIdTokenHelper(googleSecret) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleSecret,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email_verified) {
      return null;
    }
    return payload;
  } catch (err) {
    console.error('Google token verification failed:', err);
    return null;
  }
}
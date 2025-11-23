import 'dotenv/config';
import { createClient } from '@libsql/client';
import * as auth from '$lib/server/auth';

const client = createClient({
  url: process.env.DATABASE_URL
});

export async function handle({ event, resolve }) {
  // attach database client
  event.locals.db = client;

  // authentication logic (merged here so there's a single `handle` export)
  const sessionToken = event.cookies.get(auth.sessionCookieName);
  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await auth.validateSessionToken(sessionToken);

  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    auth.deleteSessionTokenCookie(event);
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
}

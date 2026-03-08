import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { isAllowedEmail, parseAllowedEmails } from '@/lib/allowlist';

const allowedEmails = parseAllowedEmails(process.env.MICO_ALLOWED_EMAILS);

const BASE = '/missioncontrol';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to auth endpoints and public pages
  if (
    pathname.startsWith(`${BASE}/api/auth`) ||
    pathname === `${BASE}/api/health` ||
    pathname === `${BASE}/login` ||
    pathname === `${BASE}/denied` ||
    pathname.startsWith(`${BASE}/_next`) ||
    pathname === `${BASE}/favicon.ico`
  ) {
    return NextResponse.next();
  }

  // Verify session
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = `${BASE}/login`;
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Enforce allowlist for all protected routes (UI + API)
  const email = (token.email as string | undefined) ?? undefined;
  if (!isAllowedEmail(email, allowedEmails)) {
    const url = req.nextUrl.clone();
    url.pathname = `${BASE}/denied`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/missioncontrol/:path*'],
};

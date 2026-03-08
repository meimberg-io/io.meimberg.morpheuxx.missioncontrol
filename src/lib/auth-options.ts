import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { isAllowedEmail, parseAllowedEmails } from '@/lib/allowlist';

const allowedEmails = parseAllowedEmails(process.env.MICO_ALLOWED_EMAILS);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/denied',
  },
  callbacks: {
    async signIn({ profile }) {
      const email = (profile as { email?: string } | null)?.email;
      return isAllowedEmail(email, allowedEmails);
    },
    async jwt({ token }) {
      // Keep email on token for middleware checks
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};

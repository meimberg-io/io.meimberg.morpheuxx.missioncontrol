'use client';

import { signIn } from 'next-auth/react';

export default function LoginClient({ nextUrl }: { nextUrl: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex max-w-md flex-col gap-4 px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Mission Control</h1>
        <p className="text-sm text-muted-foreground">
          Bitte melde dich mit Google an. Zugriff ist auf eine Whitelist beschränkt.
        </p>

        <button
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          onClick={() => signIn('google', { callbackUrl: nextUrl })}
          type="button"
        >
          Sign in with Google
        </button>

        <p className="text-xs text-muted-foreground">
          Wenn du keinen Zugriff hast, wirst du nach dem Login auf „Access denied“ geleitet.
        </p>
      </main>
    </div>
  );
}

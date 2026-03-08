export function parseAllowedEmails(value: string | undefined): Set<string> {
  return new Set(
    (value ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAllowedEmail(email: string | null | undefined, allowed: Set<string>): boolean {
  if (!email) return false;
  return allowed.has(email.trim().toLowerCase());
}

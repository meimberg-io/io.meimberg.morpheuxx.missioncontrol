import LoginClient from './ui';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const nextParam = sp.next;
  const next = Array.isArray(nextParam)
    ? nextParam[0]
    : nextParam ?? '/missioncontrol';

  return <LoginClient nextUrl={next} />;
}

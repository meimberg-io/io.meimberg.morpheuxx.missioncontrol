export default function DeniedPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex max-w-md flex-col gap-3 px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
        <p className="text-sm text-muted-foreground">
          Dein Google-Account ist nicht auf der Allowlist. Bitte kontaktiere den Admin.
        </p>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

export function AuthGate({ children }) {
  const { session, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="grid min-h-screen place-items-center">Loading your planner…</div>;
  if (session) return children;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: signInError } = await signIn(email, password);
    if (signInError) setError(signInError.message);
    setSubmitting(false);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border border-primary/15 bg-background p-8 shadow-xl">
        <div><h1 className="text-2xl font-black">Vacation Command Center</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to continue.</p></div>
        <label className="block text-sm font-medium">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
        <label className="block text-sm font-medium">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button disabled={submitting} className="w-full rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-60">{submitting ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

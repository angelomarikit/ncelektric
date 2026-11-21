import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

export function AdminLogin({ onSuccess }: { onSuccess: () => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  async function login(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const result = await supabase.auth.signInWithPassword({ email, password });
    setNotice(result.error?.message || '');
    if (!result.error) await onSuccess();
  }

  return (
    <main className="section-pad w-full max-w-xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Admin Login</h1>
      <form className="grid gap-4" onSubmit={login}>
        <label className="font-bold text-sm">
          Email
          <input type="email" required className="field mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="font-bold text-sm">
          Password
          <input
            type="password"
            required
            className="field mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-yellow">
          Sign In
        </button>
        {notice ? <p className="text-sm text-red-700">{notice}</p> : null}
      </form>
    </main>
  );
}
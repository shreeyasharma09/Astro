import { useState } from 'react';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { Panda } from '../components/Panda';
import { signInWithMagicLink } from '../services/storage';

interface AccountChoiceProps {
  onGuest: () => void;
}

export function AccountChoice({ onGuest }: AccountChoiceProps) {
  const [mode, setMode] = useState<'choose' | 'email' | 'sent'>('choose');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const sendMagicLink = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await signInWithMagicLink(email);
      setMode('sent');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Something went wrong. Try again?');
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'sent') {
    return (
      <Screen className="flex flex-col px-6 pt-10 pb-8 text-center">
        <div className="flex flex-col items-center gap-4 mt-8">
          <Panda mood="cheer" size={130} />
          <h2 className="text-2xl font-extrabold">Check your email</h2>
          <p className="text-mute-light dark:text-mute-dark text-sm leading-relaxed">
            We sent a sign-in link to <strong>{email}</strong>. Tap the link to come back signed in. No password needed.
          </p>
        </div>
        <div className="mt-auto flex flex-col gap-3">
          <Button variant="secondary" onClick={() => { setMode('choose'); setEmail(''); }}>Use a different email</Button>
          <Button variant="ghost" onClick={onGuest}>Continue as guest for now</Button>
        </div>
      </Screen>
    );
  }

  if (mode === 'email') {
    return (
      <Screen className="flex flex-col px-6 pt-10 pb-8">
        <div className="flex flex-col items-center gap-4 text-center mb-6">
          <Panda mood="listen" size={110} />
          <h2 className="text-2xl font-extrabold">What's your email?</h2>
          <p className="text-mute-light dark:text-mute-dark text-sm">We'll send you a sign-in link. No password to remember.</p>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoFocus
          className="p-4 rounded-btn bg-surface-light dark:bg-surface-dark outline-none text-base focus:ring-2 focus:ring-lilac"
        />
        {error && <p className="text-crisis text-sm mt-2">{error}</p>}
        <div className="mt-auto flex flex-col gap-3">
          <Button onClick={sendMagicLink} disabled={submitting}>
            {submitting ? 'Sending…' : 'Send sign-in link'}
          </Button>
          <button onClick={() => setMode('choose')} className="text-sm text-mute-light dark:text-mute-dark py-2 font-semibold">
            Back
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen className="flex flex-col px-6 pt-10 pb-8">
      <div className="flex flex-col items-center gap-4 text-center mb-8">
        <Panda mood="calm" size={110} />
        <h2 className="text-2xl font-extrabold">How would you like to start?</h2>
        <p className="text-mute-light dark:text-mute-dark text-sm">You can always change this later.</p>
      </div>
      <div className="flex flex-col gap-3 mt-auto">
        <Button onClick={onGuest}>Continue as guest</Button>
        <Button variant="secondary" onClick={() => setMode('email')}>Sign up with email</Button>
        <button onClick={() => setMode('email')} className="text-sm text-mute-light dark:text-mute-dark py-2 font-semibold">Already have an account? Sign in</button>
      </div>
    </Screen>
  );
}
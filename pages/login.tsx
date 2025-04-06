import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  useEffect(() => {
  const check = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      window.location.href = '/dashboard';
    }
  };

  check();
}, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const loginWithEmail = async () => {
    const email = prompt('Enter your email for magic link:');
    if (email) {
      await supabase.auth.signInWithOtp({ email });
      alert('Check your email for the magic link!');
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Sign In</h1>
      <button onClick={loginWithGoogle} className="w-full bg-blue-600 text-white p-2 rounded mb-2">
        Sign in with Google
      </button>
      <button onClick={loginWithEmail} className="w-full bg-gray-700 text-white p-2 rounded">
        Magic Link (Email)
      </button>
    </div>
  );
}


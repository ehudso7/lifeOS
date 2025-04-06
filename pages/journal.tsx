import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Journal() {
  const [user, setUser] = useState<any>(null);
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    if (!reflection.trim()) return;

    // Start session if none exists
    const { data: session } = await supabase
      .from('companion_feedback_sessions')
      .insert([
        {
          user_id: user.id,
        },
      ])
      .select()
      .single();

    // Save the reflection entry
    await supabase.from('companion_feedback_entries').insert([
      {
        session_id: session.id,
        prompt: 'Daily Reflection',
        user_response: reflection,
      },
    ]);

    setReflection('');
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Daily Reflection</h1>

      {!submitted ? (
        <>
          <textarea
            className="w-full border p-3 rounded mb-4 min-h-[150px]"
            placeholder="Write what's on your mind today..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Submit Reflection
          </button>
        </>
      ) : (
        <p className="text-green-700 font-medium">Reflection saved. See you tomorrow.</p>
      )}
    </div>
  );
}


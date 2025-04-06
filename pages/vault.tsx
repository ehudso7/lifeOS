import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Vault() {
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVault = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      const { data: rituals } = await supabase
        .from('generated_rituals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: reflections } = await supabase
        .from('companion_feedback_entries')
        .select('*, session_id')
        .in('session_id', supabase
          .from('companion_feedback_sessions')
          .select('id')
          .eq('user_id', user.id));

      const combined = [
        ...(rituals || []).map((r) => ({ ...r, type: 'ritual' })),
        ...(reflections || []).map((f) => ({ ...f, type: 'reflection' })),
      ];

      setEntries(combined.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));

      setLoading(false);
    };

    loadVault();
  }, []);

  if (loading) return <p className="p-6">Loading your Vault...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧠 Your Vault</h1>
      <div className="space-y-4">
        {entries.map((entry: any, i) => (
          <div key={i} className="border p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">
              {entry.type === 'ritual' ? '🕯️ Ritual' : '📝 Reflection'} —{' '}
              {new Date(entry.created_at).toLocaleDateString()}
            </p>
            <p className="font-medium mt-1">
              {entry.prompt?.slice(0, 100) || entry.user_response?.slice(0, 100)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


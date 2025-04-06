import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { buildCompanionPrompt } from '@/lib/promptBuilder';

export default function Rituals() {
  const [ritual, setRitual] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: pastRituals } = await supabase
      .from('generated_rituals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    const systemPrompt = buildCompanionPrompt({
      archetype: settings.companion_archetype || 'mentor',
      tone_keywords: settings.tone_keywords || [],
      memory_opt_in: settings.memory_opt_in,
      recent_rituals: pastRituals || [],
      user_name: user.email?.split('@')[0] || 'User',
    });

    const res = await fetch('/api/generate-ritual', {
      method: 'POST',
      body: JSON.stringify({ systemPrompt }),
    });

    const { ritualPrompt } = await res.json();
    setRitual(ritualPrompt);

    // Save to DB
    await supabase.from('generated_rituals').insert([
      {
        user_id: user.id,
        title: 'New Ritual',
        prompt: ritualPrompt,
        mood: 'balanced',
        tone: settings.tone_keywords?.join(', ') || '',
      },
    ]);

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Generate Ritual</h1>
      <button
        onClick={handleGenerate}
        className="bg-purple-700 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Generating...' : 'New Ritual'}
      </button>

      {ritual && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p>{ritual}</p>
        </div>
      )}
    </div>
  );
}


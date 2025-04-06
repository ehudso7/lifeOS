import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    companion_archetype: '',
    tone_keywords: '',
    memory_opt_in: false,
    reflection_frequency: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setForm({
          companion_archetype: data.companion_archetype || '',
          tone_keywords: (data.tone_keywords || []).join(', '),
          memory_opt_in: data.memory_opt_in || false,
          reflection_frequency: data.reflection_frequency || '',
        });
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = async () => {
    await supabase.from('user_settings').update({
      companion_archetype: form.companion_archetype,
      tone_keywords: form.tone_keywords.split(',').map((t) => t.trim()),
      memory_opt_in: form.memory_opt_in,
      reflection_frequency: form.reflection_frequency,
    }).eq('user_id', user.id);
    alert('Settings saved!');
  };

  if (loading) return <p className="p-6">Loading settings...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧠 Companion Settings</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Archetype</label>
          <input
            name="companion_archetype"
            value={form.companion_archetype}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="mentor, coach, sage..."
          />
        </div>

        <div>
          <label className="block font-medium">Tone Keywords</label>
          <input
            name="tone_keywords"
            value={form.tone_keywords}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="calm, motivating, humorous"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="memory_opt_in"
            checked={form.memory_opt_in}
            onChange={handleChange}
          />
          <label>Allow memory access for rituals</label>
        </div>

        <div>
          <label className="block font-medium">Reflection Frequency</label>
          <select
            name="reflection_frequency"
            value={form.reflection_frequency}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select...</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}


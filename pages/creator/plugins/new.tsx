import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

export default function NewPlugin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price_cents: 500,
    tags: '',
  });

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
    };

    check();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description) return;

    const { error } = await supabase.from('creator_plugins').insert([
      {
        creator_id: user.id,
        name: form.name,
        description: form.description,
        price_cents: Number(form.price_cents),
        tags: form.tags.split(',').map((t) => t.trim()),
        is_published: false,
      },
    ]);

    if (!error) {
      router.push('/creator/plugins');
    } else {
      alert('Error saving plugin');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Plugin</h1>

      <div className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          name="name"
          placeholder="Plugin Name"
          onChange={handleChange}
        />
        <textarea
          className="w-full border p-2 rounded"
          name="description"
          placeholder="What does it do?"
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          name="price_cents"
          type="number"
          placeholder="Price in cents"
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          name="tags"
          placeholder="Tags (comma-separated)"
          onChange={handleChange}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Save Plugin
        </button>
      </div>
    </div>
  );
}


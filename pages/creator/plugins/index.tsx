import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function CreatorDashboard() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data } = await supabase
        .from('creator_plugins')
        .select('*')
        .eq('creator_id', user.id);

      setPlugins(data || []);
    };

    load();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Plugins</h1>
      <Link href="/creator/plugins/new" className="text-blue-600 underline">
        + New Plugin
      </Link>
      <div className="mt-6 space-y-4">
        {plugins.map((p: any) => (
          <div key={p.id} className="p-4 border rounded">
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p>{p.description}</p>
            <p className="text-sm text-gray-500">
              ${p.price_cents / 100} — {p.is_published ? 'Published' : 'Draft'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


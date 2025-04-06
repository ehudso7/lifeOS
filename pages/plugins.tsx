import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Plugins() {
  const [plugins, setPlugins] = useState([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from('creator_plugins')
        .select('*')
        .eq('is_published', true);

      setPlugins(data || []);
    };

    load();
  }, []);

  const handlePurchase = async (plugin: any) => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({
        plugin_id: plugin.id,
        price_cents: plugin.price_cents,
        user_id: user.id,
      }),
    });

    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Plugin Store</h1>
      <div className="space-y-4">
        {plugins.map((plugin: any) => (
          <div key={plugin.id} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold">{plugin.name}</h2>
            <p className="text-gray-600 mb-2">{plugin.description}</p>
            <p className="text-sm font-medium text-green-600 mb-2">
              ${(plugin.price_cents / 100).toFixed(2)}
            </p>
            <button
              onClick={() => handlePurchase(plugin)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


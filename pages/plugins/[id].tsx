
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function PluginPage() {
  const router = useRouter();
  const { id: pluginId } = router.query;

  const [user, setUser] = useState<any>(null);
  const [pluginData, setPluginData] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!pluginId) return;

      // Get authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Verify plugin exists
      const { data: plugin, error: pluginError } = await supabase
        .from('creator_plugins')
        .select('*')
        .eq('id', pluginId)
        .eq('is_published', true)
        .single();

      if (pluginError || !plugin) {
        router.push('/plugins');
        return;
      }

      setPluginData(plugin);

      // Check user access
      const { data: access } = await supabase
        .from('user_plugin_access')
        .select('id')
        .eq('user_id', user.id)
        .eq('plugin_id', pluginId)
        .single();

      setHasAccess(!!access);
      setLoading(false);
    };

    init();
  }, [pluginId]);

  if (loading || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading plugin access...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Access Denied
        </h1>
        <p className="mb-6">
          You don’t have access to this plugin yet. Please purchase access
          through the plugin store.
        </p>
        <button
          onClick={() => router.push('/plugins')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Return to Plugin Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{pluginData.name}</h1>
      <p className="text-gray-700 mb-6">{pluginData.description}</p>

      {/* Plugin's real features go here */}
      <div className="border p-6 rounded-lg bg-gray-50 shadow">
        <p className="text-sm font-medium text-gray-600 mb-2">Plugin ID: {pluginId}</p>
        <p className="text-lg font-semibold text-green-700">✅ You have full access to this plugin.</p>
        {/* TODO: Replace this block with plugin-specific UI */}
      </div>
    </div>
  );
}


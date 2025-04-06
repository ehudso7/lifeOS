import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) window.location.href = '/login';
      else setUser(user);
    };
    loadUser();
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🌱 Welcome to LifeOS</h1>
      <p className="text-gray-600">Choose where you'd like to go:</p>

      <div className="grid grid-cols-2 gap-4">
        <LinkCard href="/rituals" title="Start a Ritual" emoji="🕯️" />
        <LinkCard href="/journal" title="Reflect" emoji="📝" />
        <LinkCard href="/vault" title="Vault" emoji="🧠" />
        <LinkCard href="/plugins" title="Plugins" emoji="🧩" />
        <LinkCard href="/settings" title="Settings" emoji="⚙️" />
        <LinkCard href="/creator/plugins" title="Creator Tools" emoji="🛠️" />
      </div>
    </div>
  );
}

function LinkCard({ href, title, emoji }: any) {
  return (
    <Link href={href}>
      <div className="p-4 border rounded shadow hover:bg-gray-50 transition cursor-pointer">
        <div className="text-3xl">{emoji}</div>
        <div className="font-semibold mt-2">{title}</div>
      </div>
    </Link>
  );
}


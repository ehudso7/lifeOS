import { supabase } from './supabaseClient';

export const loadUserProfile = async (userId: string, email: string) => {
  // ✅ Step 1: Upsert into custom users table
  await supabase.from('users').upsert([
    {
      id: userId,
      email: email,
    },
  ]);

  // ✅ Step 2: Upsert into user_settings if missing
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!data) {
    const { data: created } = await supabase
      .from('user_settings')
      .insert([
        {
          user_id: userId,
          companion_archetype: 'mentor',
          tone_keywords: ['encouraging', 'wise'],
          memory_opt_in: true,
          reflection_frequency: 'weekly',
        },
      ])
      .select()
      .single();

    return created;
  }

  return data;
};


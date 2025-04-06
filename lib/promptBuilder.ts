export const buildCompanionPrompt = ({
  archetype,
  tone_keywords,
  memory_opt_in,
  recent_rituals,
  user_name,
}: {
  archetype: string;
  tone_keywords: string[];
  memory_opt_in: boolean;
  recent_rituals: any[];
  user_name: string;
}) => {
  const tone = tone_keywords?.join(', ') || 'supportive, thoughtful';

  const memoryBlock = memory_opt_in && recent_rituals.length
    ? `Here are some recent rituals and emotional themes ${user_name} has explored:\n\n` +
      recent_rituals
        .map((r) => `• ${r.title} – Mood: ${r.mood} – "${r.prompt}"`)
        .join('\n') +
      '\n\nUse this as context to guide your tone and suggestions.'
    : '';

  return `
You are ${archetype}, a deeply ${tone} AI guide.
${memoryBlock}

Create a new personalized ritual prompt for ${user_name}.
Focus on emotional clarity, insight, and healing.
Return only the prompt text.
`;
};


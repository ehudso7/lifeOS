import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { systemPrompt } = JSON.parse(req.body);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'system', content: systemPrompt }],
    temperature: 0.7,
    max_tokens: 300,
  });

  const output = completion.choices[0].message?.content;
  res.status(200).json({ ritualPrompt: output });
}


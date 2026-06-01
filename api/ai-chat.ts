import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: Message[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body as RequestBody;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured',
        details: 'OPENROUTER_API_KEY is missing in server environment',
      });
    }

    // Call OpenRouter API
    // Some setups rely on Vite dev middleware, others on this Vercel handler.
    // Include the model in a way that matches OpenRouter.
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://aurazur.vercel.app',
        'X-Title': 'Aurazur Real Estate',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-2-7b-chat',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      // OpenRouter (or proxies) may return non-JSON/empty body on errors.
      // Parse safely to avoid "Unexpected end of JSON input".
      const raw = await response.text().catch(() => '');
      let errorData: any = null;
      if (raw) {
        try {
          errorData = JSON.parse(raw);
        } catch {
          errorData = raw;
        }
      }

      console.error('OpenRouter error:', errorData);
      return res
        .status(response.status)
        .json({ error: 'Failed to get AI response', details: errorData ?? raw ?? null });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: 'Internal server error', details: message });
  }
}

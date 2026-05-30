import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: 'ai-chat-middleware',
        configureServer(server) {
          server.middlewares.use(
            '/api/ai-chat',
            async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
              if (req.method !== 'POST') {
                next();
                return;
              }
              let body = '';
              req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
              req.on('end', async () => {
                try {
                  const { messages } = JSON.parse(body);
                  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                      'Content-Type': 'application/json',
                      'HTTP-Referer': 'https://aurazur.tn',
                      'X-Title': 'Aurazur IA',
                    },
                    body: JSON.stringify({
                      model: 'poolside/laguna-m.1:free',
                      messages: [
                        {
                          role: 'system',
                          content: "Tu es Aurazur IA, assistant immobilier expert à Nabeul et Hammamet, Tunisie. Réponds de façon professionnelle et concise. Tu parles français par défaut, mais tu peux aussi répondre en arabe ou en anglais selon la langue de l'utilisateur.",
                        },
                        ...messages,
                      ],
                    }),
                  });
                  const data = await response.json();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                } catch (error) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'AI service error' }));
                }
              });
            }
          );
        },
      },
    ],
    define: {
      'process.env': {},
    },
  };
});

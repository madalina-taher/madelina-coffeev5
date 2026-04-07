import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'madelina-api',
      configureServer(server) {
        server.middlewares.use('/api/save-menu', async (req, res) => {
          if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { writeFile } = await import('fs/promises');
              const menuPath = path.resolve(__dirname, 'src/data/menu.json');
              const parsed = JSON.parse(body);
              await writeFile(menuPath, JSON.stringify(parsed, null, 2), 'utf-8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, items: parsed.plats?.length ?? 0 }));
            } catch (err: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      },
    },
  ],
  base: '/madelina-coffeev5/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
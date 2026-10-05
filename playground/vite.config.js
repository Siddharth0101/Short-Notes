import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), 'INTERVIEW_');
  const apiTarget = `http://127.0.0.1:${env.INTERVIEW_PORT || 8787}`;
  return {
    plugins: [react()],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              },
            ],
          },
        },
      },
    },
    preview: { proxy: { '/api/interviewer': { target: apiTarget, ws: true } } },
    server: {
      proxy: { '/api/interviewer': { target: apiTarget, ws: true } },
      fs: {
        allow: ['..'],
        deny: [
          '.env',
          '.env.*',
          '*.{crt,pem,key}',
          '**/.git/**',
          '**/.interviews/**',
          '**/server/**',
        ],
      },
    },
    resolve: {
      alias: {
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      },
    },
  };
});

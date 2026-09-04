import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/leaderboard': 'http://127.0.0.1:8787',
      '/window': 'http://127.0.0.1:8787',
      '/vote': 'http://127.0.0.1:8787',
      '/feedback': 'http://127.0.0.1:8787',
      '/comments': 'http://127.0.0.1:8787',
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        notfound: resolve(import.meta.dirname, '404.html'),
        add: resolve(import.meta.dirname, 'pages/add.html'),
        friends: resolve(import.meta.dirname, 'pages/friends.html'),
        note: resolve(import.meta.dirname, 'pages/note.html'),
        guestbook: resolve(import.meta.dirname, 'pages/guestbook.html'),
        menu: resolve(import.meta.dirname, 'pages/menu.html'),
        rank: resolve(import.meta.dirname, 'pages/rank.html'),
      },
    },
  },
});

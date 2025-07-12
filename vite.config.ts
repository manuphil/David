import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      include: ['buffer', 'process', 'util', 'stream', 'events', 'crypto'],
      exclude: ['fs'],
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      stream: 'stream-browserify',
      util: 'util',
      crypto: 'crypto-browserify',
      events: 'events',
    },
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process/browser',
      'util',
      'stream-browserify',
      'events',
      'crypto-browserify',
      'react',
      'react-dom',
      'lucide-react',
      'react-router-dom',
      'react-icons/fa',
    ],
    exclude: [
      '@walletconnect/utils',
      '@walletconnect/core',
      '@walletconnect/sign-client',
      '@walletconnect/solana-adapter',
      '@walletconnect/universal-provider',
      '@walletconnect/time',
      '@solana/wallet-adapter-base',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      '@solana/wallet-adapter-wallets',
      '@solana/web3.js',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [],
    },
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { domainsCsvFromRootPlugin } from './vite-plugin-domains-csv'

// https://vite.dev/config/
export default defineConfig({
  plugins: [domainsCsvFromRootPlugin(), react(), tailwindcss()],
})

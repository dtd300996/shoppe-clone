/* eslint-disable @typescript-eslint/no-explicit-any */
// import { defineConfig } from 'vite'
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: false
    }),
    svgr(),
    visualizer()
  ] as any,
  test: {
    testTimeout: 15000,
    environment: 'jsdom' // or 'node'
  },
  server: {
    port: 1235
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})

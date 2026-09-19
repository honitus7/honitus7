import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode, isSsrBuild }) => {
  const plugins: PluginOption[] = [react()]
  if (process.env.ANALYZE && !isSsrBuild) {
    plugins.push(visualizer({ filename: 'stats.html', gzipSize: true, brotliSize: true, open: false }) as PluginOption)
  }
  return {
    plugins,
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
      target: 'es2022',
      sourcemap: mode !== 'production',
      modulePreload: { polyfill: false },
    },
    server: { port: 5173, strictPort: false },
  }
})

/// <reference-types="vitest"/>
import { defineConfig } from 'vitest/config'
import * as pluginPkg from '@app/zendesk/vite-plugin-inject-zaf-html/index.js'
const { injectZafHtmlPlugin } = pluginPkg.default
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {},
  plugins: [react(), injectZafHtmlPlugin()],
  base: './',
  build: {
    outDir: `${process.env.INIT_CWD}/dist/assets/${process.env.ADDON_TYPE}`,
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
})

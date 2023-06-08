/// <reference-types="vitest"/>
import { defineConfig } from 'vitest/config'
import * as pluginPkg from '@app/zendesk/vite-plugin-inject-zaf-html/index.js'
const { injectZafHtmlPlugin } = pluginPkg.default

export default defineConfig({
  test: {},
  plugins: [injectZafHtmlPlugin()],
  base: './',
  build: {
    outDir: `${process.env.INIT_CWD}/dist/assets/${process.env.ADDON_TYPE}`,
    emptyOutDir: true,
  },
})

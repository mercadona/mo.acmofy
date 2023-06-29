import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      globals: true,
      name: 'ACMOFy',
      environment: 'jsdom',
      setupFiles: './packages/ticket_sidebar/setupTests.ts',
    },
  },
])

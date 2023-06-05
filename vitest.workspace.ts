import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
    {
        test: {
            include: ['packages/**/tests/**/*.test.ts'],
            name: 'ACMOFy'
        }
    }
])

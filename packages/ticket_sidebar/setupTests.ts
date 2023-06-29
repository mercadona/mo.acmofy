import '@testing-library/jest-dom'
import { vi, expect, afterEach } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

expect.extend(matchers)

vi.mock('@app/zendesk/sdk', async () => {
  vi.stubGlobal('ZFAClient', {
    init: vi.fn(),
  })
  return {
    default: {
      request: vi.fn(),
    },
  }
})

afterEach(() => {
  cleanup()
})

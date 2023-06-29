import { vi } from 'vitest'
import { render, screen } from '../utils/test-utils'

import App from '../App'

vi.mock('@app/zendesk/sdk', async () => {
  vi.stubGlobal('ZAFClient', {
    init: vi.fn(),
  })
  return {
    default: {
      request: vi.fn(),
      on: vi.fn(),
      get: vi.fn().mockResolvedValue({
        id: '12345',
      }),
      metadata: vi.fn().mockResolvedValue({
        settings: {
          URL_ZENDESK_HOOK: 'https://example.com/api',
          MINIMUM_ORDER_ID_LENGTH: 5,
          ORDER_ID_CUSTOM_FIELD_ID: '1234567',
        },
      }),
    },
  }
})

describe('Tests for App component', () => {
  it('should render App', async () => {
    render(<App />)

    expect(await screen.findByText(/order/i)).toBeInTheDocument()
  })
})

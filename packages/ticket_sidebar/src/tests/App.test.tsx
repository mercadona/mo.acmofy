import { vi } from 'vitest'
import { render, screen } from '../utils/test-utils'

import App from '../App'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Tests for App component', () => {
  describe('when app starts', () => {
    beforeEach(() => {
      vi.mock('@app/zendesk/sdk', () => {
        vi.stubGlobal('ZAFClient', {
          init: vi.fn(),
        })
        return {
          default: {
            request: vi.fn(),
            on: vi.fn(),
            get: vi.fn().mockResolvedValue({
              ticket: {
                id: 1,
              },
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
    })

    it('should render App', async () => {
      render(<App />)

      expect(
        await screen.findByText(/introduce un pedido para continuar/i)
      ).toBeInTheDocument()
    })
  })
})

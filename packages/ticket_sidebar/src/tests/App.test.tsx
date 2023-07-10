import { render, screen, waitFor } from '../utils/test-utils'

import App from '../App'
import { Mocked, expect } from 'vitest'
import zafClient from '@app/zendesk/sdk'
import { vi } from 'vitest'

vi.mock('@app/zendesk/sdk', () => {
  return {
    default: {
      metadata: vi.fn().mockResolvedValue({
        settings: {
          URL_ZENDESK_HOOK: 'https://example.com/api',
          MINIMUM_ORDER_ID_LENGTH: 5,
          ORDER_ID_CUSTOM_FIELD_ID: '1234567',
        },
      }),
      get: vi.fn(),
      on: vi.fn().mockReturnValue(true),
      request: vi.fn().mockResolvedValue(true),
    },
  }
})

describe('Tests for App component', () => {
  let client: Mocked<typeof zafClient>

  beforeAll(() => {
    client = zafClient as Mocked<typeof zafClient>
  })

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when app starts', () => {
    it('should render App', async () => {
      client.get.mockImplementation((what: string) => {
        if (what === 'currentUser.email') {
          return Promise.resolve({
            errors: [],
            'currentUser.email': 'sgarcal123456@mercadona.es',
          })
        }

        if (what === 'ticket.customField:custom_field_1234567') {
          return Promise.resolve({
            errors: [],
            'ticket.customField:custom_field_1234567': '',
          })
        }

        if (what === 'ticket') {
          return Promise.resolve({
            errors: [],
            ticket: {
              id: 12345,
            },
          })
        }
      })

      render(<App />)

      expect(
        await screen.findByText(/introduce un pedido para continuar/i)
      ).toBeInTheDocument()
    })

    it('should not show OrderInfo if orderId is less than MINIMUM_ORDER_ID_LENGTH', async () => {
      client.get.mockImplementation((what: string) => {
        if (what === 'currentUser.email') {
          return Promise.resolve({
            errors: [],
            'currentUser.email': 'sgarcal123456@mercadona.es',
          })
        }

        if (what === 'ticket.customField:custom_field_1234567') {
          return Promise.resolve({
            errors: [],
            'ticket.customField:custom_field_1234567': '1234',
          })
        }

        if (what === 'ticket') {
          return Promise.resolve({
            errors: [],
            ticket: {
              id: 12345,
            },
          })
        }
      })

      render(<App />)

      const initialText = await screen.findByText(
        /introduce un pedido para continuar/i
      )
      expect(initialText).toBeInTheDocument()
    })

    it('should display Order information', async () => {
      client.get.mockImplementation((what: string) => {
        if (what === 'currentUser.email') {
          return Promise.resolve({
            errors: [],
            'currentUser.email': 'sgarcal123456@mercadona.es',
          })
        }

        if (what === 'ticket.customField:custom_field_1234567') {
          return Promise.resolve({
            errors: [],
            'ticket.customField:custom_field_1234567': '',
          })
        }

        if (what === 'ticket') {
          return Promise.resolve({
            errors: [],
            ticket: {
              id: 12345,
            },
          })
        }
      })
      client.on.mockImplementation((_: string, cb: (orderId: string) => void) =>
        cb('21123')
      )
      client.request.mockResolvedValue({
        status: 'checkout',
        phone_country_code: '34',
        phone_number: '66666666',
      })

      render(<App />)

      expect(await screen.findByText(/Pedido 21123/i)).toBeInTheDocument()
      expect(await screen.findByText(/\+3466666666/i)).toBeInTheDocument()
    })

    it.only('should not call fillTicketInfo before timeout', async () => {
      client.get.mockImplementation((what: string) => {
        if (what === 'currentUser.email') {
          return Promise.resolve({
            errors: [],
            'currentUser.email': 'sgarcal123456@mercadona.es',
          })
        }

        if (what === 'ticket.customField:custom_field_1234567') {
          return Promise.resolve({
            errors: [],
            'ticket.customField:custom_field_1234567': '',
          })
        }

        if (what === 'ticket') {
          return Promise.resolve({
            errors: [],
            ticket: {
              id: 12345,
            },
          })
        }
      })
      client.on.mockImplementation((_: string, cb: (orderId: string) => void) =>
        cb('21123')
      )

      render(<App />)

      const requestBody = {
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({ order_id: '21123' }),
        url: 'https://example.com/api/tickets/12345/complete/',
      }

      expect(client.request).not.toHaveBeenCalledWith(requestBody)

      await vi.advanceTimersByTimeAsync(500)

      expect(client.request).toHaveBeenCalledWith(requestBody)
    })

    describe('when User is not a Beta Tester', () => {
      it.todo('should not display something')
    })
  })
})

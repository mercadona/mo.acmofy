import { vi } from 'vitest'

const zafClient = {
  metadata: vi.fn().mockResolvedValue({
    settings: {
      URL_ZENDESK_HOOK: 'https://example.com/api',
      MINIMUM_ORDER_ID_LENGTH: 5,
      ORDER_ID_CUSTOM_FIELD_ID: '1234567',
    },
  }),
  get: vi.fn().mockImplementation((what: string) => {
    if (what === 'currentUser.email') {
      return Promise.resolve({
        errors: [],
        'currentUser.email': 'sgarcal123456@mercadona.es',
      })
    }
  }),
  on: vi.fn().mockReturnValue(true),
  request: vi.fn().mockResolvedValue(true),
}

export default zafClient

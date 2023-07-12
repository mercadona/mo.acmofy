import { render, screen } from '../utils/test-utils'
import zafClient from '@app/zendesk/sdk'
import { vi } from 'vitest'
import { Mocked, expect } from 'vitest'

import OrderInfo from '../components/OrderInfo'

vi.mock('@app/zendesk/sdk')

vi.stubGlobal('console', {
  log: vi.fn(),
  error: vi.fn(),
})

describe('OrderInfo tests', () => {
  let client: Mocked<typeof zafClient>

  beforeAll(() => {
    client = zafClient as Mocked<typeof zafClient>
  })

  it('should display Order not found message', async () => {
    client.request.mockRejectedValue({
      readyState: 4,
      responseJSON: {
        errors: [
          {
            code: 'not_found',
            detail: 'Order not found',
          },
        ],
      },
      responseText:
        '{"errors":[{"code":"not_found","detail":"Order not found"}]}',
      status: 404,
      statusText: 'Not Found',
    })
    render(<OrderInfo orderId={'21124'} />)

    expect(await screen.findByText(/Pedido 21124/i)).toBeInTheDocument()
    expect(await screen.findByText(/Pedido no encontrado/)).toBeInTheDocument()
  })
})

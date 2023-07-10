import { render, screen } from '../utils/test-utils'

import OrderStatus from '../components/OrderStatus'

describe('Tests for OrderStatus', () => {
  it.each`
    status                     | expected
    ${'checkout'}              | ${'Checkout in progress'}
    ${'confirmed'}             | ${'Confirmed'}
    ${'preparing'}             | ${'Preparing'}
    ${'prepared'}              | ${'Prepared'}
    ${'delivering'}            | ${'Delivering'}
    ${'delivered'}             | ${'Delivered'}
    ${'cancelled-by-customer'} | ${'Cancelled by customer'}
    ${'cancelled-by-system'}   | ${'Cancelled by system'}
    ${'user-unreachable'}      | ${'User unreachable'}
    ${'delayed'}               | ${'Delayed'}
  `('should render OrderStatus ($status) properly', ({ status, expected }) => {
    const order = {
      status,
      phone_country_code: 34,
      phone_number: 666543442,
    }
    render(<OrderStatus order={order} />, { wrapper: undefined })

    expect(screen.getByText(expected)).toBeInTheDocument()
  })
})

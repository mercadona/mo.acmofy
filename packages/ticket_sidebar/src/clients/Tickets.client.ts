import { HttpClient } from '../http'

interface CompleteOptions {
  ticketId: number
  orderId: string
}

/** Fill information about the ticket in the sidebar */
const complete = (
  httpClient: HttpClient,
  { ticketId, orderId }: CompleteOptions
) => {
  return httpClient.request({
    path: `tickets/${ticketId}/complete/`,
    data: {
      order_id: orderId,
    },
  })
}

const ticketsClient = Object.freeze({
  complete,
})

export { ticketsClient }

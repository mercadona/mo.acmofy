import zafClient from "@app/zendesk/sdk"
import { hasLengthGreaterOrEqualThan } from "./utils"

const MINIMUM_ORDER_ID_LENGTH = 5

type Ticket = {
    id: number,
}

type TicketResponse = {
    error: object,
    ticket: Ticket
}

const hasLengthGreaterThanN = hasLengthGreaterOrEqualThan(MINIMUM_ORDER_ID_LENGTH)

export async function init() {
  zafClient.on('ticket.custom_field_360017010219.changed', async function(order_id) {
      console.log("Se ha modificado el pedido", order_id);
      const {ticket}: TicketResponse = await zafClient.get("ticket")
      const ticket_id = ticket.id

      if (order_id && hasLengthGreaterThanN(order_id)) {
          console.log("Order id identificado: ", order_id)
          const settings = {
              url: 'http://34.110.237.158/zendesk-hook',
              type:'POST',
              contentType: 'application/json',
              data: JSON.stringify({order_id, ticket_id, acmofy: true})
          };

            try {
              const data = await zafClient.request(settings)
              console.log(`Request executed: ${data}`)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message)
                } else {
                    console.log(error)
                }
            }
      }
  });
}

import zafClient from "@app/zendesk/sdk"
import { hasLengthGreaterOrEqualThan } from "./utils"

const MINIMUM_ORDER_ID_LENGTH = 5
const ORDER_ID_CUSTOM_FIELD_ID = 360017010219
const URL_ZENDESK_HOOK = 'http://34.110.237.158/zendesk-hook'

type Ticket = {
    id: number,
}

type TicketResponse = {
    error: object,
    ticket: Ticket
}

const hasLengthGreaterThanN = hasLengthGreaterOrEqualThan(MINIMUM_ORDER_ID_LENGTH)

export async function init() {
  zafClient.on('ticket.custom_field_' + ORDER_ID_CUSTOM_FIELD_ID + '.changed', async function(order_id: any) {
      const {ticket}: TicketResponse = await zafClient.get("ticket")
      const ticket_id = ticket.id

      console.log("Tengo order id", order_id)
      if (order_id && hasLengthGreaterThanN(order_id)) {
          const settings = {
              url: URL_ZENDESK_HOOK,
              type:'POST',
              contentType: 'application/json',
              data: JSON.stringify({order_id, ticket_id, acmofy: true})
          };

          console.log("Ejecutando request")

            try {
                await zafClient.request(settings)
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

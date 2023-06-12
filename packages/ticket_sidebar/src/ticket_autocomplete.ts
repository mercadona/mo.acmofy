import zafClient from '@app/zendesk/sdk'
import { hasLengthGreaterOrEqualThan } from './utils'
import type { Settings, TicketResponse } from './types'
import HttpClient from './HttpClient'

const onOrderIdChange = async function (
  orderId: string,
  httpClient: HttpClient,
  settings: Settings
) {
  let MINIMUM_ORDER_ID_LENGTH
  if (settings) {
    MINIMUM_ORDER_ID_LENGTH = settings.MINIMUM_ORDER_ID_LENGTH
  }
  const { ticket }: TicketResponse = await zafClient.get('ticket')
  const ticketId = ticket.id

  const hasLengthGreaterThanN = hasLengthGreaterOrEqualThan(
    MINIMUM_ORDER_ID_LENGTH || 5
  )

  console.log('Tengo order id', orderId)
  if (hasLengthGreaterThanN(orderId)) {
    const data = {
      order_id: orderId,
      ticket_id: ticketId,
      acmofy: true,
    }

    console.log('Ejecutando request')

    try {
      await httpClient.request(data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log(error)
      }
    }
  }
}

export async function init() {
  const metadata = await zafClient.metadata<Settings>()

  if (!metadata.settings) return

  const ORDER_ID_CUSTOM_FIELD_ID = metadata.settings.ORDER_ID_CUSTOM_FIELD_ID
  const URL_ZENDESK_HOOK = metadata.settings.URL_ZENDESK_HOOK

  const httpClient = new HttpClient(zafClient, URL_ZENDESK_HOOK)

  const customCallback = (orderId: string) => {
    if (!orderId) return
    onOrderIdChange(orderId, httpClient, metadata.settings as Settings)
  }

  zafClient.on(
    `ticket.custom_field_${ORDER_ID_CUSTOM_FIELD_ID}.changed`,
    customCallback
  )
}

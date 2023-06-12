import zafClient from '@app/zendesk/sdk'
import { hasLengthGreaterOrEqualThan } from './utils'
import type { Settings, TicketResponse } from './types'

const processOrderId = async function (orderId: string) {
  const metadata = await zafClient.metadata<Settings>()
  let MINIMUM_ORDER_ID_LENGTH, URL_ZENDESK_HOOK
  if (metadata.settings) {
    MINIMUM_ORDER_ID_LENGTH = metadata.settings.MINIMUM_ORDER_ID_LENGTH
    URL_ZENDESK_HOOK = metadata.settings.URL_ZENDESK_HOOK
  }
  const { ticket }: TicketResponse = await zafClient.get('ticket')
  const ticketId = ticket.id

  const hasLengthGreaterThanN = hasLengthGreaterOrEqualThan(
    MINIMUM_ORDER_ID_LENGTH || 5
  )

  console.log('Tengo order id', orderId)
  if (orderId && hasLengthGreaterThanN(orderId)) {
    const settings = {
      url: URL_ZENDESK_HOOK,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        order_id: orderId,
        ticket_id: ticketId,
        acmofy: true,
      }),
    }

    console.log('Ejecutando request')

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
}

export async function init() {
  const settings = await zafClient.metadata<Settings>()
  const metadata = settings
  let ORDER_ID_CUSTOM_FIELD_ID
  if (metadata.settings) {
    ORDER_ID_CUSTOM_FIELD_ID = metadata.settings.ORDER_ID_CUSTOM_FIELD_ID
  }
  zafClient.on(
    `ticket.custom_field_${ORDER_ID_CUSTOM_FIELD_ID}.changed`,
    processOrderId
  )
}

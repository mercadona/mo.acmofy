import * as React from 'react'
import zafClient from '@app/zendesk/sdk'

import { useConfig } from './context/ConfigProvider'
import { TicketResponse } from './types'

import OrderInfo from './components/OrderInfo'
import { ticketsClient } from './clients'
import './style.css'

const App = () => {
  const { httpClient, orderIdCustomFieldId, minimumOrderIdLength } = useConfig()
  const [orderId, setOrderId] = React.useState<string>()

  const getTicketInfo = async (orderId: string) => {
    try {
      const { ticket }: TicketResponse = await zafClient.get('ticket')
      await ticketsClient.complete(httpClient, {
        ticketId: ticket.id,
        orderId,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  const handleOrderIdChange = (orderId: string) => setOrderId(orderId)

  React.useEffect(() => {
    zafClient.on(
      `ticket.custom_field_${orderIdCustomFieldId}.changed`,
      handleOrderIdChange
    )
  }, [])

  React.useEffect(() => {
    if (!orderId || orderId.length < minimumOrderIdLength) return
    getTicketInfo(orderId)
  }, [orderId])

  return orderId ? <OrderInfo orderId={orderId} /> : <p>Order not found</p>
}

export default App

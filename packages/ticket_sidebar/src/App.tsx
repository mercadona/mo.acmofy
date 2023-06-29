import * as React from 'react'
import zafClient from '@app/zendesk/sdk'

import { useConfig } from './context/ConfigProvider'
import { TicketResponse } from './types'

import OrderInfo from './components/OrderInfo'
import './style.css'

const App = () => {
  const { httpClient, orderIdCustomFieldId, idFieldMinLength } = useConfig()
  const [orderId, setOrderId] = React.useState<string>()

  const getTicketInfo = async (orderId: string) => {
    try {
      const { ticket }: TicketResponse = await zafClient.get('ticket')
      await httpClient.complete({
        orderId,
        ticketId: ticket.id,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  React.useEffect(() => {
    zafClient.on(
      `ticket.custom_field_${orderIdCustomFieldId}.changed`,
      (orderId: string) => setOrderId(orderId)
    )
  }, [])

  React.useEffect(() => {
    if (!orderId || orderId.length < idFieldMinLength) return
    getTicketInfo(orderId)
  }, [orderId])

  return orderId ? <OrderInfo orderId={orderId} /> : <p>Order not found</p>
}

export default App

import * as React from 'react'
import zafClient from '@app/zendesk/sdk'

import { useConfig } from './context/ConfigProvider'
import { TicketResponse, Ticket } from './types'

import OrderInfo from './components/OrderInfo'
import { ticketsClient } from './clients'
import './style.css'

const App = () => {
  const { httpClient, orderIdCustomFieldId, minimumOrderIdLength } = useConfig()
  const [orderId, setOrderId] = React.useState<string>()
  const [ticket, setTicket] = React.useState<Ticket>({} as Ticket)

  const getOrderInfo = async (orderId: string) => {
    try {
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

  const getTicketInfo = async () => {
    try {
      const { ticket }: TicketResponse = await zafClient.get('ticket')
      setTicket(ticket)
    } catch (error) {
      console.error(error)
    }
  }

  const handleOrderIdChange = (orderId: string) => setOrderId(orderId)

  React.useEffect(() => {
    zafClient.on(
      `ticket.custom_field_${orderIdCustomFieldId}.changed`,
      handleOrderIdChange
    )
  }, [])

  React.useEffect(() => void getTicketInfo(), [])

  React.useEffect(() => {
    if (!orderId || orderId.length < minimumOrderIdLength) return
    getOrderInfo(orderId)
  }, [orderId])

  return orderId ? (
    <OrderInfo orderId={orderId} />
  ) : (
    <p className="bold">Introduce un pedido para continuar</p>
  )
}

export default App

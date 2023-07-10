import * as React from 'react'
import zafClient from '@app/zendesk/sdk'

import { useConfig } from './context/ConfigProvider'
import { TicketResponse, Ticket } from './types'

import OrderInfo from './components/OrderInfo'
import { ticketsClient } from './clients'
import { useDebounce } from 'react-use'

import './style.css'

const DEBOUNCE_MS = 500

const App = () => {
  const { httpClient, orderIdCustomFieldId, minimumOrderIdLength } = useConfig()
  const [orderId, setOrderId] = React.useState<string>()
  const [ticket, setTicket] = React.useState<Ticket>({} as Ticket)

  useDebounce(
    () => {
      if (!orderId || orderId.length < minimumOrderIdLength) return
      if (!ticket || typeof ticket.id === 'undefined') return

      fillTicketInfo(orderId, ticket.id)
    },
    DEBOUNCE_MS,
    [orderId, ticket.id]
  )

  const fillTicketInfo = async (orderId: string, ticketId: number) => {
    try {
      await ticketsClient.complete(httpClient, {
        ticketId,
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

  const getOrderId = async () => {
    try {
      const response = await zafClient.get(
        `ticket.customField:custom_field_${orderIdCustomFieldId}`
      )

      const key = `ticket.customField:custom_field_${orderIdCustomFieldId}`
      if (key in response) {
        if (response[key] !== '') {
          setOrderId(response[key])
        }
      }
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

  React.useEffect(() => void getOrderId(), [])

  return orderId && orderId.length >= minimumOrderIdLength ? (
    <OrderInfo orderId={orderId} />
  ) : (
    <p className="bold">Introduce un pedido para continuar</p>
  )
}

export default App

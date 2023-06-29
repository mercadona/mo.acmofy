import * as React from 'react'
import { Grid, Col, Row } from '@zendeskgarden/react-grid'
import zafClient from '@app/zendesk/sdk'

import { useConfig } from './context/ConfigProvider'
import { TicketResponse } from './types'

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

  return (
    <Grid>
      <Row>
        <Col size={12}>Pedido {orderId}</Col>
      </Row>
      <Row
        style={{
          marginTop: 16,
        }}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Col size={1}></Col>
        <Col size={4}>Estado</Col>
        <Col size={7}>
          <div className="indicator__confirmed"></div>Confirmado
        </Col>
      </Row>
    </Grid>
  )
}

export default App

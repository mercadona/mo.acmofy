import * as React from 'react'
import { Grid, Col, Row } from '@zendeskgarden/react-grid'
import OrderStatus from './OrderStatus'
import { Order } from '../types'
import { useConfig } from '../context/ConfigProvider'
import { ordersClient } from '../clients'
import { hasLengthGreaterOrEqualThan } from '../utils'
import zafClient from '@app/zendesk/sdk'
import { Button } from '@zendeskgarden/react-buttons'

type OrderInfoProps = {
  orderId: string | undefined
  ticketId: number
  requesterId: number
}

const OrderInfo = ({ orderId, ticketId, requesterId }: OrderInfoProps) => {
  const [order, setOrder] = React.useState<Order>({} as Order)
  const { httpClient, minimumOrderIdLength } = useConfig()

  const getOrderInfo = async (orderId: string) => {
    try {
      const order = await ordersClient.getOrderDetail<Order>(
        httpClient,
        orderId
      )
      setOrder(order)
    } catch (error) {
      console.error(error)
    }
  }

  const callClient = () => {
    zafClient.trigger('voice.dialout', {
      number: `+${order.phone_country_code}${order.phone_number}`,
      from: 'ticket_editor',
      userId: requesterId,
      ticketId: ticketId,
    })
  }

  React.useEffect(() => {
    const hasLengthGreaterOrEqualN =
      hasLengthGreaterOrEqualThan(minimumOrderIdLength)
    if (!(orderId && hasLengthGreaterOrEqualN(orderId))) return

    getOrderInfo(orderId)
  }, [orderId])

  if (!orderId) return null

  return (
    <Grid gutters={false}>
      <Row>
        <Col className="title" size={12}>
          Pedido {orderId}
        </Col>
      </Row>
      <OrderStatus order={order} />
      <Row>
        <Col size={6} offset={1}>
          <Button size="small" style={{ marginLeft: 4 }} onClick={callClient}>
            Llamar
          </Button>
        </Col>
      </Row>
    </Grid>
  )
}

export default OrderInfo

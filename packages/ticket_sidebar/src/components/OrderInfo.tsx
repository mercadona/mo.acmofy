import * as React from 'react'
import { Grid, Col, Row } from '@zendeskgarden/react-grid'
import OrderStatus from './OrderStatus'
import { Order, BackendError } from '../types'
import { Icon } from '../icons'

import { useConfig } from '../context/ConfigProvider'
import { ordersClient } from '../clients'
import { hasLengthGreaterOrEqualThan } from '../utils'

import { styled } from 'styled-components'

type OrderInfoProps = {
  orderId: string | undefined
}

const BoldText = styled.span`
  color: var(--zd-color-grey-800);
  font-weight: bold;
`

const isBackendError = (error: unknown): error is BackendError => {
  if (typeof error === 'object') {
    if (error !== null) {
      return 'responseJSON' in error
    }
  }
  return false
}

const OrderInfo = ({ orderId }: OrderInfoProps) => {
  const { httpClient, minimumOrderIdLength } = useConfig()
  const [order, setOrder] = React.useState<Order | null>(null)
  const [error, setError] = React.useState<BackendError | null>(null)

  const getOrderDetail = async (orderId: string) => {
    try {
      const order = await ordersClient.getOrderDetail<Order>(
        httpClient,
        orderId
      )
      setOrder(order)
      setError(null)
    } catch (error: unknown) {
      console.log(error)
      if (isBackendError(error)) {
        setError(error)
      }
    }
  }

  React.useEffect(() => {
    const hasLengthGreaterOrEqualN =
      hasLengthGreaterOrEqualThan(minimumOrderIdLength)
    if (!(orderId && hasLengthGreaterOrEqualN(orderId))) return

    getOrderDetail(orderId)
  }, [orderId])

  if (error) {
    if (error.status === 404) {
      return (
        <Grid gutters={false}>
          <Row>
            <Col
              className="title"
              xs={12}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Icon type={'alert'} />
              <BoldText style={{ marginLeft: 8 }}>
                El pedido {orderId} no existe
              </BoldText>
            </Col>
          </Row>
        </Grid>
      )
    }

    return (
      <Grid gutters={false}>
        <Row>
          <Col className="title" xs={12}>
            <BoldText>Pedido {orderId}</BoldText>
          </Col>
        </Row>
        {error.statusText}
      </Grid>
    )
  }

  if (!order) return null

  return (
    <Grid gutters={false}>
      <Row>
        <Col className="title" xs={12}>
          <BoldText>Pedido {orderId}</BoldText>
        </Col>
      </Row>
      <OrderStatus order={order} />
    </Grid>
  )
}

export default OrderInfo

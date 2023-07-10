import { Row, Col } from '@zendeskgarden/react-grid'
import { Indicator } from './styled'
import type { Order, OrderStatus } from '../types'
import { getOrderStatus } from '../utils'
import { styled } from 'styled-components'

type OrderStatusProps = {
  order: Order
}

const Separator = styled.hr`
  color: var(--zd-color-grey-200);
  margin: 16px 0;
`

const Span = styled.span`
  color: var(--zd-color-grey-600);
`

const OrderStatus = ({ order }: OrderStatusProps) => {
  const capitalizedText = getOrderStatus(order.status)

  return (
    <>
      <Row
        style={{
          marginTop: 24,
        }}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Col xs={3} offsetXs={1}>
          <Span>Estado</Span>
        </Col>
        <Col
          xs={8}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Indicator $type={order.status} />
          {capitalizedText}
        </Col>
      </Row>
      <Separator />
      <Row justifyContent={'center'} alignItems={'center'}>
        <Col xs={3} offsetXs={1}>
          <Span>Teléfono</Span>
        </Col>
        <Col
          xs={8}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {`+${order.phone_country_code}${order.phone_number}`}
        </Col>
      </Row>
    </>
  )
}

export default OrderStatus

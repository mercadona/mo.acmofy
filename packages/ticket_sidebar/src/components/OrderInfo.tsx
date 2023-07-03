import { Grid, Col, Row } from '@zendeskgarden/react-grid'
import type { OrderStatus as OrderStatusType } from './styled'
import OrderStatus from './OrderStatus'
import { styled } from 'styled-components'

type OrderInfoProps = {
  orderId: string | undefined
}

const STATES: Array<{ [key: string]: string }> = [
  { Checkout: 'checkout' },
  { Confirmado: 'confirmed' },
  { Preparando: 'preparing' },
  { Preparado: 'prepared' },
  { Entregando: 'delivering' },
  { Entregado: 'delivered' },
  { 'Cancelado por el cliente': 'cancelled_by_customer' },
  { 'Cancelado por el sistema': 'cancelled_by_system' },
  { 'Usuario no disponible': 'user_unreachable' },
  { Atrasado: 'delayed' },
]

const getRandomState = (
  states: typeof STATES
): { text: string; status: OrderStatusType } => {
  const idx = Math.floor(Math.random() * Object.keys(states).length)

  const state = Object.keys(STATES[idx])[0]

  return {
    text: state,
    status: states[idx][state] as OrderStatusType,
  }
}

const Separator = styled.hr`
  color: var(--zd-color-grey-200);
`

const OrderInfo = ({ orderId }: OrderInfoProps) => {
  // const [order, setOrder] = React.useState()

  // const getOrderInfo = (orderId: string) => {
  //   // TODO: Call endpoint to retrieve order info
  // }

  // React.useEffect(() => {
  //   if (!orderId) return

  //   getOrderInfo(orderId)
  // }, [orderId])

  if (!orderId) return null

  const { text, status } = getRandomState(STATES)

  return (
    <Grid gutters={false}>
      <Row>
        <Col className="title" size={12}>
          Pedido {orderId}
        </Col>
      </Row>
      <OrderStatus status={status} text={text} />
      <Separator />
    </Grid>
  )
}

export default OrderInfo

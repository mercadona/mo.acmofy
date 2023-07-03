import { Grid, Col, Row } from '@zendeskgarden/react-grid'
import { Indicator, OrderStatus } from './styled'

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
): { text: string; value: OrderStatus } => {
  const idx = Math.floor(Math.random() * Object.keys(states).length)

  const state = Object.keys(STATES[idx])[0]

  return {
    text: state,
    value: states[idx][state] as OrderStatus,
  }
}

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

  const { text, value } = getRandomState(STATES)

  return (
    <Grid>
      <Row>
        <Col className="title" size={12}>
          Pedido {orderId}
        </Col>
      </Row>
      <Row
        style={{
          marginTop: 14,
        }}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Col size={1}></Col>
        <Col className="state" size={4}>
          Estado
        </Col>
        <Col
          size={7}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Indicator $type={value} />
          {text}
        </Col>
      </Row>
    </Grid>
  )
}

export default OrderInfo

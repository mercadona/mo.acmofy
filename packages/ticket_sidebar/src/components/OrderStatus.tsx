import { Row, Col } from '@zendeskgarden/react-grid'
import { Indicator } from './styled'
import type { OrderStatus } from './styled'

type OrderStatusProps = {
  status: OrderStatus
  text: string
}

const OrderStatus = ({ status, text }: OrderStatusProps) => {
  return (
    <Row
      style={{
        marginTop: 14,
        marginBottom: 16,
      }}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Col className="state" size={3} offset={1}>
        Estado
      </Col>
      <Col
        size={8}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Indicator $type={status} />
        {text}
      </Col>
    </Row>
  )
}

export default OrderStatus

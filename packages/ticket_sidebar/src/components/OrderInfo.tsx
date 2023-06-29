// import * as React from 'react'
import { Grid, Col, Row } from '@zendeskgarden/react-grid'

type OrderInfoProps = {
  orderId: string | undefined
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

  if (!orderId) return

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
          <div className="indicator__confirmed"></div>Confirmado
        </Col>
      </Row>
    </Grid>
  )
}

export default OrderInfo

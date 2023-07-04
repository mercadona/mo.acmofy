import { HttpClient } from '../http'

const getOrderDetail = <T>(httpClient: HttpClient, orderId: string) => {
  return httpClient.request<T>({
    path: `orders/${orderId}/detail/`,
  })
}

const ordersClient = Object.freeze({
  getOrderDetail,
})

export { ordersClient }

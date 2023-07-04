import { OrderStatus } from './types'

export type hasGreaterOrEqualFn = (len: number) => (str: string) => boolean
export const hasLengthGreaterOrEqualThan: hasGreaterOrEqualFn =
  (len: number) => (str: string) =>
    str.length >= len

const STATUS_MAP = new Map<OrderStatus, string>([
  ['checkout', 'Checkout'],
  ['confirmed', 'Confirmed'],
  ['preparing', 'Preparing'],
  ['prepared', 'Prepared'],
  ['delivering', 'Delivering'],
  ['delivered', 'Delivered'],
  ['cancelled_by_customer', 'Cancelled by customer'],
  ['cancelled_by_system', 'Cancelled by system'],
  ['user_unreachable', 'User unreachable'],
  ['delayed', 'Delayed'],
])
export const getOrderStatus = (status: OrderStatus) => {
  return STATUS_MAP.get(status)
}

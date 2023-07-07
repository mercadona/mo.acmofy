import { OrderStatus } from './types'

export type hasGreaterOrEqualFn = (len: number) => (str: string) => boolean
export const hasLengthGreaterOrEqualThan: hasGreaterOrEqualFn =
  (len: number) => (str: string) =>
    str.length >= len

const STATUS_MAP = new Map<OrderStatus, string>([
  ['checkout', 'Checkout in progress'],
  ['confirmed', 'Confirmed'],
  ['preparing', 'Preparing'],
  ['prepared', 'Prepared'],
  ['delivering', 'Delivering'],
  ['delivered', 'Delivered'],
  ['cancelled-by-customer', 'Cancelled by customer'],
  ['cancelled-by-system', 'Cancelled by system'],
  ['user-unreachable', 'User unreachable'],
  ['delayed', 'Delayed'],
])
export const getOrderStatus = (status: OrderStatus) => {
  return STATUS_MAP.get(status)
}

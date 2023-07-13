export type BackendError = {
  readyState: number
  responseJSON: { [key: string]: Array<object> }
  responseText: string
  status: number
  statusText: string
}

export type Ticket = {
  id: number
  requester: {
    id: number // This is possibly undefined
  }
}

export type TicketResponse = {
  error: object
  ticket: Ticket
}

export type OrderStatus =
  | 'checkout'
  | 'confirmed'
  | 'preparing'
  | 'prepared'
  | 'delivering'
  | 'delivered'
  | 'cancelled-by-customer'
  | 'cancelled-by-system'
  | 'user-unreachable'
  | 'delayed'

export type Order = {
  status: OrderStatus
  phone_country_code: number
  phone_number: number
}

export type Settings = {
  MINIMUM_ORDER_ID_LENGTH: number
  URL_ZENDESK_HOOK: string
  ORDER_ID_CUSTOM_FIELD_ID: number
}

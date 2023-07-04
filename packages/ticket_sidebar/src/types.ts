export type Ticket = {
  id: number
}

export type TicketResponse = {
  error: object
  ticket: Ticket
}

export type Settings = {
  MINIMUM_ORDER_ID_LENGTH: number
  URL_ZENDESK_HOOK: string
  ORDER_ID_CUSTOM_FIELD_ID: number
}

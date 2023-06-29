import zafClient from '@app/zendesk/sdk'

type ZendeskClient = typeof zafClient

type TicketInfo = {
  orderId: string
  ticketId: number
}

class HttpClient {
  private client: ZendeskClient
  private zendeskURL: string

  public constructor(zafClient: ZendeskClient, zendeskURL: string) {
    this.client = zafClient
    this.zendeskURL = zendeskURL
  }

  request(data: object): Promise<unknown> {
    const settings = {
      url: this.zendeskURL,
      type: 'POST' as const,
      contentType: 'application/json',
      data: JSON.stringify(data),
    }

    return this.client.request(settings)
  }

  get(): Promise<unknown> {
    const settings = {
      url: this.zendeskURL,
      type: 'GET' as const,
    }

    return this.client.request(settings)
  }

  complete(ticketInfo: TicketInfo): Promise<unknown> {
    const settings = {
      url: `${this.zendeskURL}${ticketInfo.ticketId}/complete/`,
      type: 'POST' as const,
      contentType: 'application/json',
      data: JSON.stringify({
        order_id: ticketInfo.orderId,
      }),
    }

    return this.client.request(settings)
  }
}

export default HttpClient

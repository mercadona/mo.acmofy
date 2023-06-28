import zafClient from '@app/zendesk/sdk'

type ZendeskClient = typeof zafClient

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
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
    }

    return this.client.request(settings)
  }

  get(): Promise<unknown> {
    const settings = {
      url: this.zendeskURL,
      type: 'GET',
    }

    return this.client.request(settings)
  }
}

export default HttpClient

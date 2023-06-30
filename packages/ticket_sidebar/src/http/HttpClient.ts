import zafClient from '@app/zendesk/sdk'
import type { RequestOptions } from '@app/zendesk/sdk'

type ZendeskClient = typeof zafClient

// type TicketInfo = {
//   orderId: string
//   ticketId: number
// }

type PartialRequestOptions = Partial<RequestOptions> & { path?: string }

// replace :: RegExp -> String -> String -> String
const replace = (re: RegExp) => (repl: string) => (s: string) =>
  s.replace(re, repl)

class HttpClient {
  private client: ZendeskClient
  private zendeskURL: string

  public constructor(zafClient: ZendeskClient, zendeskURL: string) {
    this.client = zafClient
    const replaceLastSlash = replace(/\/$/)('')
    this.zendeskURL = replaceLastSlash(zendeskURL)
  }

  request(options: PartialRequestOptions): Promise<unknown> {
    const defaultSettings: PartialRequestOptions = {
      url: this.zendeskURL,
      type: 'GET',
    }

    const requestSettings: PartialRequestOptions = {
      url: options.path
        ? `${this.zendeskURL}/${options.path}`
        : this.zendeskURL,
      type: options.data ? 'POST' : 'GET',
      contentType: options.data
        ? 'application/json'
        : 'application/x-www-form-urlencoded; charset=UTF-8',
      data: options.data ? JSON.stringify(options.data) : undefined,
    }

    const settings = {
      ...defaultSettings,
      ...requestSettings,
    }

    return this.client.request(settings)
  }
}

export { HttpClient }

// URL: http://34.110.237.158/api/acmo
// Field Id: 360017010219

import { describe, expect, it, vi, afterEach } from 'vitest'
import HttpClient from '../HttpClient'
import zafClient from '@app/zendesk/sdk'

vi.mock('@app/zendesk/sdk', async () => {
  vi.stubGlobal('window', {
    ZAFClient: {
      init: vi.fn(),
    },
  })
  return {
    default: {
      request: vi.fn(),
    },
  }
})

describe('HttpClient tests', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should construct an instance of HttpClient', () => {
    const zendeskURL = 'https://example.com'
    const httpClient = new HttpClient(zafClient, zendeskURL)

    expect(httpClient).toBeInstanceOf(HttpClient)
  })

  it('should call client with correct parameters', async () => {
    const zendeskURL = 'https://example.com'
    const httpClient = new HttpClient(zafClient, zendeskURL)

    const data = { order_id: 1, ticket_id: 2112, acmofy: true }

    await httpClient.request(data)

    expect(zafClient.request).toHaveBeenCalledOnce()
    expect(zafClient.request).toHaveBeenCalledWith({
      url: 'https://example.com',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
    })
  })

  it('should call client with correct parameters', async () => {
    const zendeskURL = 'https://example.com'
    const httpClient = new HttpClient(zafClient, zendeskURL)

    await httpClient.get()

    expect(zafClient.request).toHaveBeenCalledOnce()
    expect(zafClient.request).toHaveBeenCalledWith({
      url: 'https://example.com',
      type: 'GET',
    })
  })
})

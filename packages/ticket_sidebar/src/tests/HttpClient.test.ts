import { describe, expect, it, vi, afterEach } from 'vitest'
import { HttpClient } from '../http'
import zafClient from '@app/zendesk/sdk'

describe('HttpClient tests', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should construct an instance of HttpClient', () => {
    const zendeskURL = 'https://example.com'
    const httpClient = new HttpClient(zafClient, zendeskURL)

    expect(httpClient).toBeInstanceOf(HttpClient)
  })

  it('should call client with GET and without data', async () => {
    const zendeskURL = 'https://example.com/api/'
    const httpClient = new HttpClient(zafClient, zendeskURL)

    await httpClient.request({ path: 'customers/' })

    expect(zafClient.request).toHaveBeenCalledOnce()
    expect(zafClient.request).toHaveBeenCalledWith({
      url: 'https://example.com/api/customers/',
      type: 'GET',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    })
  })

  it('should call client with POST method and data', async () => {
    const zendeskURL = 'https://example.com'
    const httpClient = new HttpClient(zafClient, zendeskURL)

    const data = { order_id: 1, ticket_id: 2112, acmofy: true }

    await httpClient.request({ data })

    expect(zafClient.request).toHaveBeenCalledOnce()
    expect(zafClient.request).toHaveBeenCalledWith({
      url: 'https://example.com',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
    })
  })
})

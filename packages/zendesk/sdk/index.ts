// The ZAFClient is injected in the index.html file when built / served.
// See docs for help regarding the ZAFClient: https://developer.zendesk.com/apps/docs/developer-guide/getting_started

interface IMetadata<T> {
  appId: number
  installationId: number
  name: string
  plan: {
    name: string
  }
  settings?: T
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// https://developer.zendesk.com/api-reference/apps/apps-core-api/client_api/#clientrequestoptions
export interface RequestOptions {
  accepts: object
  autoRetry: boolean
  cache: boolean
  contentType: string | boolean
  cors: boolean
  crossDomain: boolean
  data: object | string | Array<unknown>
  dataType: 'text' | 'json'
  headers: object
  httpCompleteResponse: boolean
  ifModified: boolean
  jwt: object
  mimeType: string
  secure: boolean
  timeout: number
  traditional: boolean
  type: HttpMethod
  url: string
  xhrFields: object
}

interface IClient {
  invoke: (cmd: string, arg: any) => void
  get: (getter: string) => any
  metadata: <U>() => Promise<IMetadata<U>>
  request: <U>(options: Partial<RequestOptions>) => Promise<U>
  on: (eventName: string, listener: (...args: any) => any) => void
  off: (eventName: string, listener?: (...args: any) => any) => void
}

declare global {
  interface Window {
    ZAFClient: {
      init: () => IClient
    }
  }
}

let zafClient: IClient
if (typeof window.ZAFClient === 'undefined') {
  // eslint-disable-line no-undef
  throw new Error('ZAFClient cannot run outside Zendesk')
} else {
  zafClient = window.ZAFClient.init() // eslint-disable-line no-undef
}

export default zafClient

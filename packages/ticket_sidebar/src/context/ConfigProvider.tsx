import * as React from 'react'
import { HttpClient } from '../http'
import zafClient from '@app/zendesk/sdk'
import { ALLOWED_EMAILS } from '../constants'

type Config = {
  httpClient: HttpClient
  minimumOrderIdLength: number
  orderIdCustomFieldId: number
}

type ZendeskConfig = {
  URL_ZENDESK_HOOK: string
  MINIMUM_ORDER_ID_LENGTH: number
  ORDER_ID_CUSTOM_FIELD_ID: number
}

type CurrentUserEmailResponse = {
  errors: object
  'currentUser.email': string
}

type IsBetaTester = {
  isBetaTester: boolean
}

const ConfigContext = React.createContext<(Config & IsBetaTester) | null>(null)
ConfigContext.displayName = 'ConfigContext'

export const ConfigProvider = ({
  children,
}: {
  children: React.ReactChildren | React.ReactNode
}) => {
  const [config, setConfig] = React.useState<Config>()
  const [isBetaTester, setIsBetaTester] = React.useState(false)

  const getConfig = async () => {
    const metadata = await zafClient.metadata<ZendeskConfig>()

    if (!metadata.settings) return null

    const {
      URL_ZENDESK_HOOK,
      MINIMUM_ORDER_ID_LENGTH,
      ORDER_ID_CUSTOM_FIELD_ID,
    } = metadata.settings

    const httpClient = new HttpClient(zafClient, URL_ZENDESK_HOOK)

    const value = {
      httpClient,
      minimumOrderIdLength: MINIMUM_ORDER_ID_LENGTH,
      orderIdCustomFieldId: ORDER_ID_CUSTOM_FIELD_ID,
    }

    setConfig(value)
  }

  const isBetaTesterUser = async () => {
    try {
      const userEmailResponse: CurrentUserEmailResponse = await zafClient.get(
        'currentUser.email'
      )
      const email = userEmailResponse['currentUser.email']
      setIsBetaTester(ALLOWED_EMAILS.includes(email))
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => void getConfig(), [])

  React.useEffect(() => void isBetaTesterUser(), [])

  if (!config) return null

  return (
    // @ts-ignore
    <ConfigContext.Provider value={{ ...config, isBetaTester }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  const configContext = React.useContext(ConfigContext)

  if (!configContext) {
    throw new Error('useConfig hook must be used inside a ConfigProvider')
  }

  return configContext
}

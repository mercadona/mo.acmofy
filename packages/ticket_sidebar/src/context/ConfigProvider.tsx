import * as React from 'react'
import { HttpClient } from '../http'
import zafClient from '@app/zendesk/sdk'

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

const ConfigContext = React.createContext<Config | null>(null)
ConfigContext.displayName = 'ConfigContext'

export const ConfigProvider = ({
  children,
}: {
  children: React.ReactChildren | React.ReactNode
}) => {
  const [config, setConfig] = React.useState<Config>()

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

  React.useEffect(() => {
    getConfig()
  }, [])

  if (!config) return null

  return (
    // @ts-ignore
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export const useConfig = () => {
  const configContext = React.useContext(ConfigContext)

  if (!configContext) {
    throw new Error('useConfig hook must be used inside a ConfigProvider')
  }

  return configContext
}

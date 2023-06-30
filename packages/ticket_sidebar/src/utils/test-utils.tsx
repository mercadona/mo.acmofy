import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { render } from '@testing-library/react'
import { ConfigProvider } from '../context/ConfigProvider'
import { ThemeProvider } from '@zendeskgarden/react-theming'

afterEach(() => {
  cleanup()
})

const AllProviders = ({ children }: { children: React.ReactElement }) => {
  return (
    <ThemeProvider>
      <ConfigProvider>{children}</ConfigProvider>
    </ThemeProvider>
  )
}

const customRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: AllProviders })
}

export * from '@testing-library/react'
export { customRender as render }

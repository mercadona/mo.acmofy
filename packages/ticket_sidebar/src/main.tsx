import React from 'react'
import ReactDOM from 'react-dom/client'

import { ThemeProvider } from '@zendeskgarden/react-theming'
import App from './App'
import { ConfigProvider } from './context/ConfigProvider'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ConfigProvider>
  </React.StrictMode>
)

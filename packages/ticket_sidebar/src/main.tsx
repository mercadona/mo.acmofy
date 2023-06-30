import React from 'react'
import ReactDOM from 'react-dom'

import { ThemeProvider } from '@zendeskgarden/react-theming'
import App from './App'
import { ConfigProvider } from './context/ConfigProvider'

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('app')
)

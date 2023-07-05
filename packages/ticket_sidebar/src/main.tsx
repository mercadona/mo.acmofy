import ReactDOM from 'react-dom'

import { ThemeProvider } from '@zendeskgarden/react-theming'
import App from './App'
import { ConfigProvider } from './context/ConfigProvider'

ReactDOM.render(
  <ConfigProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ConfigProvider>,
  document.getElementById('app')
)

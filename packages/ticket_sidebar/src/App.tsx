import * as React from 'react'

import './style.css'

const App = () => {
  const [counter, setCounter] = React.useState(0)

  const increment = () => setCounter((prev) => prev + 1)
  const decrement = () => setCounter((prev) => prev - 1)

  return (
    <main>
      <h1>Acmofy React test</h1>
      <p>Counter is: {counter}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </main>
  )
}

export default App

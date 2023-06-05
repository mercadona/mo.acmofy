import './style.css'
import { init } from './ticket_autocomplete'

document.querySelector('#app')!.innerHTML = `
    <h1>Como estan las máquinas</h1>
`

init()

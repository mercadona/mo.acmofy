import minimist from 'minimist'
import { run } from './util.mjs'

const {
  _: [app],
} = minimist(process.argv.slice(2))

run({
  pkg: `@app/${app}`,
  cmd: 'npm run dev',
  cwd: `packages/${app}`,
})

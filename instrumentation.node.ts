import { resolve } from 'path'
import { existsSync } from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'

export async function register() {
  const stopsPath = resolve(process.cwd(), 'public', 'gtfs-stops.json')
  const routesPath = resolve(process.cwd(), 'public', 'gtfs-routes.json')

  const missing = !existsSync(stopsPath) || !existsSync(routesPath)
  if (!missing && process.env.NODE_ENV === 'production') {
    return
  }

  try {
    console.log('[GTFS] Fetching fresh static data on startup…')
    const exec = promisify(execFile)
    const scriptPath = resolve(process.cwd(), 'scripts', 'fetch-gtfs.mjs')
    const { stdout, stderr } = await exec('node', [scriptPath])
    if (stdout) process.stdout.write(stdout)
    if (stderr) process.stderr.write(stderr)
    console.log('[GTFS] Static data ready.')
  } catch (err) {
    console.warn('[GTFS] Startup fetch failed (stale data may be used):', err)
  }
}

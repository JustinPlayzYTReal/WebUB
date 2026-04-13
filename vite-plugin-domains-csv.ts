import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'

/**
 * Serves and ships `Domains.csv` from the project root at `/Domains.csv`
 * so the app can fetch it without copying into `public/`.
 */
export function domainsCsvFromRootPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'domains-csv-from-root',
    configResolved(resolved) {
      config = resolved
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        if (pathname !== '/Domains.csv') {
          next()
          return
        }
        const filePath = path.join(config.root, 'Domains.csv')
        if (!fs.existsSync(filePath)) {
          next()
          return
        }
        res.setHeader('Content-Type', 'text/csv; charset=utf-8')
        res.setHeader('Cache-Control', 'no-cache')
        fs.createReadStream(filePath).on('error', next).pipe(res)
      })
    },
    closeBundle() {
      const src = path.join(config.root, 'Domains.csv')
      const dest = path.join(config.root, config.build.outDir, 'Domains.csv')
      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.copyFileSync(src, dest)
      }
    },
  }
}

/**
 * Copies Domains.csv into public/Domains.csv so Vite can serve it at /Domains.csv
 * Usage: node scripts/copy-domains.mjs [path-to-Domains.csv]
 * Default source matches the common Majestic export location on this machine.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dest = path.join(root, 'public', 'Domains.csv')

const defaultSrc = path.join(
  'C:',
  'Users',
  'Recording',
  'Downloads',
  'top10milliondomains.csv',
  'Domains.csv',
)

const src = path.resolve(process.argv[2] ?? defaultSrc)

if (!fs.existsSync(src)) {
  console.error('Source file not found:', src)
  console.error('Pass the path to Domains.csv as the first argument.')
  process.exit(1)
}

fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.copyFileSync(src, dest)
console.log('Copied')
console.log('  from:', src)
console.log('  to:  ', dest)
console.log('Restart npm run dev if it is running.')

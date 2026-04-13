/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional: override URL for the domain CSV (default /Domains.csv) */
  readonly VITE_DOMAINS_CSV_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Loads the Majestic Million CSV from `/Domains.csv` (project-root file is served by Vite; see vite-plugin-domains-csv).
 */
export async function getDomainsCsvStream(
  signal?: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  const url = import.meta.env.VITE_DOMAINS_CSV_URL ?? '/Domains.csv'
  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(
      `Could not load Domains.csv (${res.status}). Place Domains.csv in the project folder next to package.json.`,
    )
  }
  if (!res.body) {
    throw new Error('Empty response when loading Domains.csv.')
  }
  return res.body
}

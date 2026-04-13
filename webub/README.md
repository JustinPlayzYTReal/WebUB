# WebUB 🔍

A modern search engine web app built with React + Vite + TypeScript + Tailwind CSS.
Inspired by Google — powered by SerpAPI or Brave Search API.

---

## Features

- **Homepage** — centered logo, search bar, "WebUB Search" & "I'm Feeling Lucky" buttons
- **Results page** — result cards with favicon, URL, title, snippet
- **Skeleton loading** — animated placeholder UI while fetching
- **Pagination** — 10 pages with prev/next navigation
- **Dark mode** — toggle with a single click, persisted to localStorage
- **Session caching** — repeated searches don't re-hit the API
- **Keyboard support** — Enter to search, Escape to clear
- **Responsive** — works on mobile, tablet, and desktop
- **Tab navigation** — All, Images, News, Videos, Maps tabs

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo-url>
cd webub
npm install
```

### 2. Get an API key

**Option A — SerpAPI** (recommended, 100 free searches/month)
1. Sign up at https://serpapi.com
2. Copy your API key from the dashboard

**Option B — Brave Search API** (alternative)
1. Sign up at https://api.search.brave.com
2. Copy your API key

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# For SerpAPI:
VITE_SERPAPI_KEY=your_key_here
VITE_SEARCH_PROVIDER=serpapi

# For Brave Search:
VITE_BRAVE_API_KEY=your_key_here
VITE_SEARCH_PROVIDER=brave
```

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── Logo.tsx          # WebUB colored logo
│   ├── SearchBar.tsx     # Reusable search input (home + results variants)
│   ├── SearchResult.tsx  # Single result card
│   ├── ResultsList.tsx   # Results list with skeleton + error states
│   ├── Header.tsx        # Results page sticky header with tabs
│   ├── Footer.tsx        # Home + results footer
│   └── Pagination.tsx    # Page navigation
├── pages/
│   ├── HomePage.tsx      # / route
│   └── SearchPage.tsx    # /search?q=... route
├── hooks/
│   ├── useSearch.ts      # Data fetching hook with session cache
│   └── useDarkMode.ts    # Dark mode toggle with localStorage
├── services/
│   └── searchService.ts  # SerpAPI + Brave API abstraction
├── types/
│   └── search.ts         # TypeScript interfaces
├── App.tsx               # Router setup
├── main.tsx              # React entry point
└── index.css             # Tailwind + global styles
```

---

## Build for Production

```bash
npm run build
npm run preview
```

The output goes to `dist/` — deploy to Vercel, Netlify, or any static host.

---

## Extending WebUB

### Add Image Search
In `src/services/searchService.ts`, add a `searchImages()` function using the SerpAPI `tbm=isch` parameter, then wire it up in `SearchPage.tsx` when `activeTab === 'images'`.

### Add News Search
Use SerpAPI's `tbm=nws` parameter for news results.

### Add Autocomplete
Wire up SerpAPI's autocomplete endpoint (`/autocomplete`) to show suggestions as the user types in `SearchBar.tsx`.

---

## License
MIT

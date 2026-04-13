const links = [
  'Advertising',
  'Business',
  'About',
  'Privacy',
  'Terms',
  'Settings',
] as const

export function Footer() {
  return (
    <footer className="w-full border-t border-white/15 bg-black py-4 text-sm text-white/65">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 sm:justify-between">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
          {links.map((label) => (
            <a
              key={label}
              href="#"
              className="outline-none ring-white/30 transition hover:text-white focus-visible:ring-2"
              onClick={(e) => e.preventDefault()}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

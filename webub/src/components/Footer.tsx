interface FooterProps {
  variant?: 'home' | 'results'
}

const FOOTER_LEFT = ['About', 'Advertising', 'Business']
const FOOTER_RIGHT = ['Privacy', 'Terms', 'Settings']

export function Footer({ variant = 'home' }: FooterProps) {
  const isHome = variant === 'home'

  return (
    <footer
      className={`
        border-t border-[#e4e4e4] dark:border-[#3c4043]
        bg-[#f2f2f2] dark:bg-[#171717]
        text-[14px] text-[#70757a]
        ${isHome ? 'mt-auto' : ''}
      `}
    >
      {isHome && (
        <div className="px-6 py-2 border-b border-[#e4e4e4] dark:border-[#3c4043]">
          <p className="text-center text-[13px] text-[#70757a]">Virginia Beach, VA</p>
        </div>
      )}
      <div className="flex flex-wrap justify-between px-6 py-3 gap-3">
        <div className="flex gap-5">
          {FOOTER_LEFT.map((label) => (
            <a key={label} href="#" className="hover:underline transition-colors">
              {label}
            </a>
          ))}
        </div>
        <div className="flex gap-5">
          {FOOTER_RIGHT.map((label) => (
            <a key={label} href="#" className="hover:underline transition-colors">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

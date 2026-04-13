interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <span className={`font-medium tracking-tight select-none ${sizes[size]} ${className}`}>
      <span className="text-[#4285f4]">Web</span>
      <span className="text-[#ea4335]">U</span>
      <span className="text-[#34a853]">B</span>
    </span>
  )
}

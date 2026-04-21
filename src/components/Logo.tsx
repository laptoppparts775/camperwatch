export default function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#166534"/>
      <path d="M32 8 L48 36 H16 Z" fill="#4ade80"/>
      <path d="M24 22 L36 44 H12 Z" fill="#86efac"/>
      <rect x="28" y="44" width="8" height="12" rx="1" fill="#bbf7d0"/>
      <circle cx="49" cy="18" r="6" fill="#fbbf24" opacity="0.9"/>
    </svg>
  )
}

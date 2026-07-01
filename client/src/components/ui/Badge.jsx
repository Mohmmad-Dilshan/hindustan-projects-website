/**
 * Badge component — small label chips for categories, status, tags.
 */

const variants = {
  blue: 'bg-brand-blue/10 text-brand-blue',
  red: 'bg-brand-red/10 text-brand-red',
  gray: 'bg-gray-100 text-text-muted',
  green: 'bg-emerald-50 text-emerald-700',
  yellow: 'bg-amber-50 text-amber-700',
}

/**
 * @param {'blue'|'red'|'gray'|'green'|'yellow'} [props.variant='blue']
 * @param {string} [props.className]
 */
export default function Badge({ children, variant = 'blue', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

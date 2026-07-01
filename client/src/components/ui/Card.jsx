/**
 * Card component — clean white card with subtle blue-tinted shadow.
 * hover variant adds lift effect for clickable cards.
 */

/**
 * @param {object} props
 * @param {boolean} [props.hoverable=false] — adds hover lift + shadow transition
 * @param {string} [props.className]
 * @param {keyof JSX.IntrinsicElements} [props.as='div']
 */
export default function Card({
  children,
  hoverable = false,
  className = '',
  as: Tag = 'div',
  ...props
}) {
  const base = 'bg-white rounded-lg border border-gray-100'
  const shadow = 'shadow-[0_2px_8px_0_rgba(26,62,140,0.08)]'
  const hover = hoverable
    ? 'transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_24px_0_rgba(26,62,140,0.14)] cursor-pointer'
    : ''

  return (
    <Tag className={`${base} ${shadow} ${hover} ${className}`} {...props}>
      {children}
    </Tag>
  )
}

/**
 * Container — consistent max-width wrapper used across all pages.
 * Default: max-w-7xl, centered, horizontal padding.
 */

const widths = {
  default: 'max-w-7xl',
  narrow: 'max-w-4xl',
  wide: 'max-w-screen-2xl',
  full: 'max-w-full',
}

/**
 * @param {'default'|'narrow'|'wide'|'full'} [props.width='default']
 * @param {string} [props.className]
 * @param {keyof JSX.IntrinsicElements} [props.as='div']
 */
export default function Container({
  children,
  width = 'default',
  className = '',
  as: Tag = 'div',
}) {
  return (
    <Tag className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${widths[width]} ${className}`}>
      {children}
    </Tag>
  )
}

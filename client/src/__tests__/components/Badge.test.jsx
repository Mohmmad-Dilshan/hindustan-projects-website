/**
 * Badge.test.jsx — Unit tests for the Badge UI component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Web Development</Badge>)
    expect(screen.getByText('Web Development')).toBeInTheDocument()
  })

  it('defaults to blue variant', () => {
    const { container } = render(<Badge>Default</Badge>)
    expect(container.querySelector('span').className).toContain('text-brand-blue')
  })

  it('applies red variant correctly', () => {
    const { container } = render(<Badge variant="red">Hot</Badge>)
    expect(container.querySelector('span').className).toContain('text-brand-red')
  })

  it('applies gray variant correctly', () => {
    const { container } = render(<Badge variant="gray">Inactive</Badge>)
    expect(container.querySelector('span').className).toContain('bg-gray-100')
  })

  it('applies green variant correctly', () => {
    const { container } = render(<Badge variant="green">Active</Badge>)
    expect(container.querySelector('span').className).toContain('text-emerald-700')
  })

  it('applies yellow variant correctly', () => {
    const { container } = render(<Badge variant="yellow">Pending</Badge>)
    expect(container.querySelector('span').className).toContain('text-amber-700')
  })

  it('merges custom className', () => {
    const { container } = render(<Badge className="ml-2">Custom</Badge>)
    expect(container.querySelector('span').className).toContain('ml-2')
  })

  it('renders as an inline span element', () => {
    render(<Badge>Test</Badge>)
    // Badge wraps in <span>
    expect(screen.getByText('Test').tagName).toBe('SPAN')
  })
})

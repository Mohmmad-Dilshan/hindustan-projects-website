/**
 * ErrorBoundary.test.jsx
 *
 * Tests that ErrorBoundary:
 *  - Renders children when no error
 *  - Catches a thrown error and shows fallback UI
 *  - Shows the error message in the fallback
 *  - Reload button calls window.location.reload
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// ── Helper: component that throws on render ─────────────────
function BombComponent({ shouldThrow = false }) {
  if (shouldThrow) {
    throw new Error('Test: deliberate render crash')
  }
  return <div data-testid="child-content">Child rendered OK</div>
}

// ─────────────────────────────────────────────────────────────
describe('ErrorBoundary', () => {
  it('renders children normally when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.queryByText(/system recovery/i)).not.toBeInTheDocument()
  })

  it('renders the fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/system recovery triggered/i)).toBeInTheDocument()
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()
  })

  it('displays the error message in the fallback', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/test: deliberate render crash/i)).toBeInTheDocument()
  })

  it('shows a "Reload Application" button in the fallback', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByRole('button', { name: /reload application/i })).toBeInTheDocument()
  })

  it('calls window.location.reload when Reload button is clicked', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    const reloadBtn = screen.getByRole('button', { name: /reload application/i })
    fireEvent.click(reloadBtn)

    expect(window.location.reload).toHaveBeenCalledOnce()
  })

  it('renders multiple children without issues when no error', () => {
    render(
      <ErrorBoundary>
        <span>First</span>
        <span>Second</span>
      </ErrorBoundary>
    )

    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })
})

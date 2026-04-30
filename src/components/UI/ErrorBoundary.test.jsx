import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary.jsx';

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Works fine</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Works fine')).toBeTruthy();
  });
});

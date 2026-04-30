import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import GlassCard from './GlassCard.jsx';

describe('GlassCard', () => {
  it('renders children', () => {
    const { container } = render(<GlassCard><span>Test</span></GlassCard>);
    expect(container.textContent).toContain('Test');
  });

  it('renders with glass class', () => {
    const { container } = render(<GlassCard><span>X</span></GlassCard>);
    expect(container.querySelector('.glass')).toBeTruthy();
  });

  it('renders gradient when gradient=true', () => {
    const { container } = render(<GlassCard gradient><span>X</span></GlassCard>);
    expect(container.querySelector('[class*="h-0.5"]')).toBeTruthy();
  });

  it('no gradient when gradient=false', () => {
    const { container } = render(<GlassCard gradient={false}><span>X</span></GlassCard>);
    expect(container.querySelector('[class*="h-0.5"]')).toBeFalsy();
  });

  it('fires onClick handler', () => {
    let clicked = false;
    const { container } = render(<GlassCard onClick={() => { clicked = true; }}><span>X</span></GlassCard>);
    fireEvent.click(container.firstChild);
    expect(clicked).toBe(true);
  });

  it('applies custom className', () => {
    const { container } = render(<GlassCard className="custom-test"><span>X</span></GlassCard>);
    expect(container.querySelector('.custom-test')).toBeTruthy();
  });

  it('renders cursor-pointer when onClick provided', () => {
    const { container } = render(<GlassCard onClick={() => {}}><span>X</span></GlassCard>);
    expect(container.querySelector('[class*="cursor-pointer"]')).toBeTruthy();
  });
});

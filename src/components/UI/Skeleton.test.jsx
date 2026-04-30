import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SkeletonLine, SkeletonCard, SkeletonPage } from './Skeleton.jsx';

describe('SkeletonLine', () => {
  it('renders with skeleton class', () => {
    const { container } = render(<SkeletonLine />);
    expect(container.querySelector('.skeleton')).toBeTruthy();
  });

  it('renders with custom width', () => {
    const { container } = render(<SkeletonLine width="50%" />);
    expect(container.querySelector('.skeleton').style.width).toBe('50%');
  });

  it('renders with custom height', () => {
    const { container } = render(<SkeletonLine height="3rem" />);
    expect(container.querySelector('.skeleton').style.height).toBe('3rem');
  });

  it('defaults to 100pct width', () => {
    const { container } = render(<SkeletonLine />);
    expect(container.querySelector('.skeleton').style.width).toBe('100%');
  });
});

describe('SkeletonCard', () => {
  it('renders with glass class', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.glass')).toBeTruthy();
  });

  it('renders 1 title + N lines (default 3)', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelectorAll('.skeleton').length).toBe(4);
  });

  it('renders custom line count plus title', () => {
    const { container } = render(<SkeletonCard lines={5} />);
    expect(container.querySelectorAll('.skeleton').length).toBe(6);
  });

  it('last content line is 40pct', () => {
    const { container } = render(<SkeletonCard lines={2} />);
    const lines = container.querySelectorAll('.skeleton');
    expect(lines[lines.length - 1].style.width).toBe('40%');
  });
});

describe('SkeletonPage', () => {
  it('renders with px-4 container', () => {
    const { container } = render(<SkeletonPage />);
    expect(container.querySelector('[class*="px-4"]')).toBeTruthy();
  });

  it('contains skeleton cards', () => {
    const { container } = render(<SkeletonPage />);
    expect(container.querySelectorAll('.glass').length).toBeGreaterThanOrEqual(2);
  });
});

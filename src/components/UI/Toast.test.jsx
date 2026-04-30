import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToastContainer, { toast } from './Toast.jsx';

describe('ToastContainer', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders nothing initially', () => {
    render(<ToastContainer />);
    const items = document.querySelectorAll('[class*="rounded-xl"]');
    expect(items.length).toBe(0);
  });
});

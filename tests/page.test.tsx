// tests/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Warp UI baseline', () => {
  it('renders header text', () => {
    render(<Page />);
    expect(screen.getByText(/llmphysics — warp UI/i)).toBeInTheDocument();
  });
});

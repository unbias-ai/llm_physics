// tests/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Warp UI baseline', () => {
  it('renders header with title', () => {
    render(<Page />);
    expect(screen.getByText(/llmphysics — warp UI/i)).toBeInTheDocument();
  });

  it('renders mode navigation', () => {
    render(<Page />);
    expect(screen.getByText('Mode:')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('renders workspace section', () => {
    render(<Page />);
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('PR #1 baseline')).toBeInTheDocument();
  });

  it('renders editor placeholder', () => {
    render(<Page />);
    expect(screen.getByText('Editor (future)')).toBeInTheDocument();
    expect(screen.getByText(/Python \+ SymPy/i)).toBeInTheDocument();
  });

  it('renders visualization placeholder', () => {
    render(<Page />);
    expect(screen.getByText('Visualization (future)')).toBeInTheDocument();
    expect(screen.getByText(/Reserved for D3\.js/i)).toBeInTheDocument();
  });

  it('renders audit note', () => {
    render(<Page />);
    expect(screen.getByText(/audit: baseline layout only/i)).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<Page />);
    expect(screen.getByText(/Deployed on Vercel/i)).toBeInTheDocument();
  });

  it('has correct Tailwind classes on main element', () => {
    const { container } = render(<Page />);
    const main = container.querySelector('main');
    expect(main).toHaveClass('min-h-screen', 'bg-black', 'text-white');
  });
});

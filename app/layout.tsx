// app/layout.tsx
// Uses Vercel defaults, wraps the app with semantic HTML.

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'llmphysics — warp UI',
  description: 'Minimal, reproducible starter for neon-console physics visualizations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TongTu — China Travel Assistant',
  description: 'Multilingual travel assistant for foreign tourists visiting China. Powered by FlyAI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

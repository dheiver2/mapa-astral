// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mapa Astral',
  description: 'Calcule seu mapa astral online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// app/page.tsx
import { AstralChart } from './components/AstralChart/AstralChart';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <AstralChart />
      </div>
    </main>
  );
}

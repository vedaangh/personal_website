import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vedaangh Rungta',
  description: 'Personal Website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
} 
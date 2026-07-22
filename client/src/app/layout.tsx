import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'PremiumStore — Premium Digital Products',
  description: 'Buy trusted subscriptions, software, templates and digital products with fast delivery.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppWrapper } from '@/components/AppWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Simple Todo App',
  description: 'A clean and simple todo list application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
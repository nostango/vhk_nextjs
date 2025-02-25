'use client'

import localFont from "next/font/local";
import "./globals.css";
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import { useEffect, useState } from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  preload: true,
  display: 'swap'
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: true,
  display: 'swap'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const baseClasses = `${geistSans.variable} ${geistMono.variable} antialiased`;

  // Default to 'en' if i18n.language is not available
  const language = i18n.language || 'en';

  return (
    <html lang={language}>
      <body className={baseClasses}>
        {mounted ? (
          <I18nextProvider i18n={i18n}>
            {children}
          </I18nextProvider>
        ) : null}
      </body>
    </html>
  );
}
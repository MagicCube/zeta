'use client';

import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';

import { theme } from './styles/theme';

import './styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Zeta</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="A chatbot capable of answering any question using built-in tools."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body>
        <CssVarsProvider defaultMode="dark" theme={theme}>
          <CssBaseline />
          {children}
        </CssVarsProvider>
      </body>
    </html>
  );
}

import { type Viewport, type Metadata } from 'next';
import dynamic from 'next/dynamic';

const DynamicMain = dynamic(() => import('./_components/_main'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Zeta',
  description:
    'Zeta is a personal assistant capable of answering any question using LLM and built-in tools.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'contain',
  width: 'device-width',
};

export default function Page() {
  return <DynamicMain />;
}

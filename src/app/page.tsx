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
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  width: 'device-width',
  userScalable: false,
  interactiveWidget: 'resizes-content',
  colorScheme: 'dark',
};

export default function Page() {
  return <DynamicMain />;
}

import Main from './_components/_main';

export const metadata = {
  appleWebApp: {
    appCapable: 'yes',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport = {
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  width: 'device-width',
};

export default async function Page() {
  return <Main />;
}

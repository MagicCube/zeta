import dynamic from 'next/dynamic';

const DynamicMain = dynamic(() => import('./_components/_main'), {
  ssr: false,
});

export default function Page() {
  return <DynamicMain />;
}

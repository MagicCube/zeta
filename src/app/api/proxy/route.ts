import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')!;
  const res = await fetch(url);
  const response = new Response(res.body, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'text/plain',
    },
  });
  return response;
}

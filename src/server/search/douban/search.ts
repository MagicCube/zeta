import { type DoubanSearchResult } from '.';

export async function searchMovies({ q, count }: { q: string; count: number }) {
  console.info(process.env.DOUBAN_API_KEY);
  const res = await fetch('https://api.douban.com/v2/movie/search', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q, count, apikey: process.env.DOUBAN_API_KEY }),
  });
  const json = await res.json();
  return json as DoubanSearchResult;
}

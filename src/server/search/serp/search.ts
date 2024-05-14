import { getJson } from 'serpapi';

import { sleep } from '~/shared/utils/sleep';

import { type SERPSearchResult } from './search-result';
import result from './search-result.json';

export async function serpSearch({
  q,
  google_domain,
  location,
  locale,
  country,
}: {
  q: string;
  google_domain?: string;
  location?: string;
  locale?: string;
  country?: string;
}): Promise<SERPSearchResult> {
  // const result = await getJson({
  //   google_domain,
  //   api_key: process.env.SERP_API_KEY,
  //   q,
  //   location,
  //   hl: locale,
  //   gl: country,
  // });
  await sleep(1000);
  return result as unknown as SERPSearchResult;
}

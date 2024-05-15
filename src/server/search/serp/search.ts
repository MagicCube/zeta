import { getJson } from 'serpapi';

import { sleep } from '~/shared/utils/sleep';

import { type SERPSearchResult } from './search-result';
import result from './search-result.json';

export interface SERPSearchRequest {
  q: string;
  google_domain?: string;
  location?: string;
  locale?: string;
  country?: string;
}

export async function serpSearch({
  q,
  google_domain,
  location,
  locale,
  country,
}: SERPSearchRequest): Promise<SERPSearchResult> {
  const result = await getJson({
    google_domain,
    api_key: getAPIKey(),
    q,
    location,
    hl: locale,
    gl: country,
  });
  return result as SERPSearchResult;
}

export async function mockSearch(
  _: SERPSearchRequest
): Promise<SERPSearchResult> {
  await sleep(1000);
  return result as unknown as SERPSearchResult;
}

const apiKeys = process.env.SERP_API_KEY!.split(',').map((i) => i.trim());
function getAPIKey() {
  const apiKeyIndex = Math.round(Date.now() / 1000) % apiKeys.length;
  return apiKeys[apiKeyIndex];
}

import { type Tool } from '~/shared/tools';

import {
  type SERPSearchResult,
  serpSearch,
  mockSearch,
} from '../../search/serp';

import { renderSearchResult } from './renderer';

export class SearchTool implements Tool<{ results: SearchResult[] }> {
  readonly name = 'search';

  async run(params: string[]) {
    const searchRequest = {
      q: params[0]!,
      country: 'cn',
      location: 'Beijing, Beijing, China',
      locale: 'zh-cn',
    };
    let result: SERPSearchResult;
    if (false) {
      result = await serpSearch(searchRequest);
    } else {
      result = await mockSearch(searchRequest);
    }
    const results = extractSearchResults(result);
    return {
      content: renderSearchResult(results),
      data: { results },
    };
  }
}

export interface SearchResult {
  title: string;
  description: string;
  link: string;
  source: string;
  imageURL?: string;
  faviconURL?: string;
}

export function extractSearchResults(result: SERPSearchResult): SearchResult[] {
  const organicResults: SearchResult[] = result.organic_results.map((r) => ({
    title: r.title,
    description: r.snippet,
    link: r.link,
    source: r.source,
    faviconURL: r.favicon,
  }));
  return [...organicResults];
}

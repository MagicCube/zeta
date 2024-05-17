import { searchMovies, type DoubanSubject } from '~/server/search/douban';
import { type Tool } from '~/shared/tools';

import {
  type SERPSearchResult,
  serpSearch,
  mockSearch,
} from '../../search/serp';

import { renderSearchResponse } from './renderer';

export class SearchTool implements Tool<{ response: SearchResponse }> {
  readonly name = 'search';

  async run(params: string[]) {
    const searchRequest = {
      q: params[0]!,
      country: 'cn',
      location: 'Beijing, Beijing, China',
      locale: 'zh-cn',
    };
    let result: SERPSearchResult;
    if (process.env.SEARCH_ENABLED === 'true') {
      result = await serpSearch(searchRequest);
    } else {
      result = await mockSearch(searchRequest);
    }

    const processedResult = await processResult(result);
    return {
      content: renderSearchResponse(processedResult),
      data: { response: processedResult },
    };
  }
}

export interface SearchResponse {
  subject?: SearchSubject;
  organicResults: SearchEntry[];
}

export interface SearchEntry {
  title: string;
  description: string;
  date: string;
  link: string;
  source: string;
  imageURL?: string;
  faviconURL?: string;
}

export interface SearchSubject extends DoubanSubject {}

export async function processResult(
  result: SERPSearchResult
): Promise<SearchResponse> {
  let subject: SearchSubject | undefined;
  const entityTypes = result.knowledge_graph?.entity_type.split(', ');
  if (
    entityTypes &&
    (entityTypes.includes('tv') ||
      entityTypes.includes('tvm') ||
      entityTypes.includes('movie'))
  ) {
    const { subjects } = await searchMovies({
      q: result.knowledge_graph!.title,
      count: 1,
    });
    if (subjects) {
      subject = subjects[0];
    }
  }
  const organicResults: SearchEntry[] = result.organic_results.map((r) => ({
    title: r.title,
    description: r.snippet,
    date: r.date,
    link: r.link,
    source: r.source,
    faviconURL: r.favicon,
  }));
  return { subject, organicResults: organicResults };
}

import { type Tool } from '~/shared/tools';

import {
  type SERPSearchResult,
  serpSearch,
  mockSearch,
} from '../../search/serp';

import { renderSearchResult } from './renderer';

export class SearchTool implements Tool<SERPSearchResult> {
  readonly name = 'search';

  async run(params: string[]) {
    const searchRequest = {
      q: params[0]!,
      country: 'cn',
      location: 'Beijing, Beijing, China',
      locale: 'zh-cn',
    };
    let result: SERPSearchResult;
    if (true) {
      result = await serpSearch(searchRequest);
    } else {
      result = await mockSearch(searchRequest);
    }
    return {
      content: renderSearchResult(result),
      data: result,
    };
  }
}

import { type Tool } from '~/shared/tools';

import { type SERPSearchResult, serpSearch, mockSearch } from '../search/serp';

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
    if (false) {
      result = await serpSearch(searchRequest);
    } else {
      result = await mockSearch(searchRequest);
    }
    return {
      content: JSON.stringify(result, null, 2),
      data: result,
    };
  }
}

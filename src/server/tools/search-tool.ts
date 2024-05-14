import { type Tool } from '~/shared/tools';

import { type SERPSearchResult, serpSearch } from '../search/serp';

export class SearchTool implements Tool<SERPSearchResult> {
  readonly name = 'search';

  async run(params: string[]) {
    const result = await serpSearch({
      q: params[0]!,
      country: 'cn',
      location: 'Beijing, Beijing, China',
      locale: 'zh-cn',
    });
    return {
      content: JSON.stringify(result, null, 2),
      data: result,
    };
  }
}

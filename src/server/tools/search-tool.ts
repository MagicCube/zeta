import { getJson } from 'serpapi';

import { type Tool } from '~/shared/tools';

export class SearchTool implements Tool<Record<string, unknown>> {
  readonly name = 'search';

  async run(params: string[]) {
    const result = await getJson({
      google_domain: 'google.com',
      api_key: process.env.SERP_API_KEY,
      q: params[0],
      location: 'Beijing, China',
      hl: 'zh-cn',
      gl: 'cn',
    });
    return {
      response: result,
      content: JSON.stringify(result, null, 2),
    };
  }
}

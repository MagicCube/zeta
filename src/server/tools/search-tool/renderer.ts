import { type SearchResult } from '..';

export function renderSearchResult(results: SearchResult[]) {
  return `# Search Results
${results
  .map((result, i) => `## ${i + 1}. ${result.title}\n${result.description}`)
  .join('\n\n')}`;
}

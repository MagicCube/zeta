import { type SearchResponse } from '..';

export function renderSearchResult(results: SearchResponse) {
  return `# Organic Results
${results.organicResults
  .map((result, i) => `## ${i + 1}. ${result.title}\n${result.description}`)
  .join('\n\n')}`;
}

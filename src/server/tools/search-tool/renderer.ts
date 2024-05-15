import { type SERPSearchResult } from '~/server/search/serp';

export function renderSearchResult(result: SERPSearchResult) {
  return `# Organic Results
${renderOrganicResult(result)}`;
}

function renderOrganicResult(result: SERPSearchResult) {
  return result.organic_results
    .map(
      (r) => `## ${r.position}.${r.title}
${r.snippet}`
    )
    .join('\n\n');
}

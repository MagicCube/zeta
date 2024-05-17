import { type SearchResponse, type SearchEntry, type SearchSubject } from '..';

export function formatSearchResponse(res: SearchResponse) {
  return `# Retrieved Results
${formatSubject(res.subject)}
${formatSearchResult(res.organicResults)}`;
}

export function formatSubject(subject?: SearchSubject) {
  if (!subject) return '';
  return `## ${subject.title} (${subject.year})
Douban Rating: ${subject.rating.average} of 10
Genres: ${subject.genres.join(' / ')}
Directors: ${subject.directors.map((p) => p.name).join(' / ')}
Casts: ${subject.casts.map((p) => p.name).join(' / ')}\n`;
}

function formatSearchResult(results: SearchEntry[]) {
  return results
    .map(
      (result, i) =>
        `## ${i + 1}. ${result.title}\n${result.date} — ${result.description}`
    )
    .join('\n\n');
}

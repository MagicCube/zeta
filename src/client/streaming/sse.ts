export interface ServerSentEvent {
  type: 'message';
  data: string;
}

export async function* fetchServerSentEvents(
  url: string,
  init: RequestInit
): AsyncIterable<ServerSentEvent> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    ...init,
  });
  if (response.status !== 200) {
    throw new Error(`Failed to fetch from ${url}: ${response.status}`);
  }
  // Read from response body, event by event. An event always ends with a '\n\n'.
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += new TextDecoder().decode(value);
    while (true) {
      const index = buffer.indexOf('\n\n');
      if (index === -1) {
        break;
      }
      const chunk = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      yield parseServerSentEvent(chunk);
    }
  }
}

function parseServerSentEvent(chunk: string) {
  const result: ServerSentEvent = {
    type: 'message',
    data: '',
  };
  for (const line of chunk.split('\n')) {
    const kv = line.split(': ');
    if (kv.length === 2 && kv[0] === 'data') {
      result.data = kv[1]!;
    }
  }
  return result;
}

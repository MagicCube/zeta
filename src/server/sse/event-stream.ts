export class EventStreamResponse extends Response {
  constructor(asyncGenerator: AsyncGenerator<unknown>, init?: ResponseInit) {
    const stream = asyncIteratorToStream(asyncGenerator);
    super(stream, {
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
      ...init,
    });
  }
}

const encoder = new TextEncoder();
function pack(data: unknown, raw = false) {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return encoder.encode(`data: ${raw ? data : JSON.stringify(data)}\n\n`);
}

function asyncIteratorToStream(iterator: AsyncIterator<unknown>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(pack(value));
      }
    },
  });
}

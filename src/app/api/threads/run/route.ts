import { type NextRequest } from 'next/server';

import { EventStreamResponse } from '~/server/sse';
import { ServerThread } from '~/server/threads';
import { type Thread } from '~/shared/threads';

export async function POST(request: NextRequest) {
  const thread = (await request.json()) as Thread;
  return runThread(thread);
}

export function GET(request: NextRequest) {
  const question =
    request.nextUrl.searchParams.get('q') ?? '介绍一下《幕府将军》这部剧';
  const thread: Thread = {
    id: '1eed32dfa',
    messages: [
      {
        id: 'f8b0ce48a',
        type: 'text',
        role: 'user',
        content: question,
      },
    ],
    createdTime: Date.now(),
  };
  return runThread(thread);
}

async function runThread(threadData: Thread) {
  const thread = new ServerThread(threadData);
  return new EventStreamResponse(thread.run());
}

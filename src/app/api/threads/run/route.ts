import { type NextRequest } from 'next/server';

import { EventStreamResponse } from '~/server/streaming';
import { ServerThread } from '~/server/threads';

export async function POST(request: NextRequest) {
  const json = await request.json();
  const thread = new ServerThread(json);
  return new EventStreamResponse(thread.run());
}

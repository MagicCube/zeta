import { EventStreamResponse } from '~/server/streaming';
import { ServerThread } from '~/server/thread/server-thread';

export async function GET() {
  const thread = new ServerThread('22a70f22-f307-43ec-9c73-a8f1164b34ed');
  thread.appendMessage({
    type: 'text',
    id: '669beed4-d14f-4cc1-b589-d6bf0d998647',
    role: 'user',
    content: '幕府将军的主角是谁？',
  });
  return new EventStreamResponse(thread.run());
}

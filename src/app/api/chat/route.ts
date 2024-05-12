import { EventStreamResponse } from '~/server/streaming';
import { sleep } from '~/shared/utils/sleep';

export async function GET() {
  const tokens =
    'Eiusmod amet ea Lorem do aliqua consectetur ex Lorem occaecat ullamco end.'.split(
      ' '
    );
  return new EventStreamResponse(async function* () {
    for (const token of tokens) {
      yield { message: token };
      await sleep(200 * Math.random());
    }
  });
}

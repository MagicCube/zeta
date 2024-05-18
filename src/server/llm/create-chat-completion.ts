import Groq from 'groq-sdk';

import {
  type ChatCompletionChunk,
  type ChatCompletionRequest,
} from '~/shared/llm';

import { createHTTPAgentIfConfigured } from '../network';

const groq = new Groq({
  httpAgent: createHTTPAgentIfConfigured(),
});

export async function createChatCompletionStream(
  req: Partial<ChatCompletionRequest>
): Promise<{
  controller: AbortController;
  stream: ReadableStream<string>;
}> {
  const normalizeReq = normalizeChatCompletionRequest(req);
  const streamResponse = await groq.chat.completions.create({
    ...normalizeReq,
    stream: true,
  });
  return {
    controller: streamResponse.controller,
    stream: convertChunksToStream(streamResponse),
  };
}

function normalizeChatCompletionRequest(
  req: Partial<ChatCompletionRequest>
): ChatCompletionRequest {
  return {
    model: req.model ?? 'llama3-70b-8192',
    max_tokens: req.max_tokens ?? 4096,
    temperature: req.temperature ?? 0,
    top_p: req.top_p === 0 || req.top_p === undefined ? 1e-7 : req.top_p,
    seed: req.seed ?? 0,
    messages: req.messages ?? [],
  };
}

function convertChunksToStream(
  streamedChunks: AsyncIterable<ChatCompletionChunk>
): ReadableStream<string> {
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of streamedChunks) {
        if (chunk.choices[0]?.delta.content) {
          controller.enqueue(chunk.choices[0]?.delta.content);
        }
      }
      controller.close();
    },
  });
}

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
  streamedChunks: AsyncIterable<ChatCompletionChunk>;
}> {
  const normalizeReq = normalizeChatCompletionRequest(req);
  const streamResponse = await groq.chat.completions.create({
    ...normalizeReq,
    stream: true,
  });
  return {
    controller: streamResponse.controller,
    streamedChunks: streamResponse,
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

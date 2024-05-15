import { type ChatCompletionChunk } from 'groq-sdk/lib/chat_completions_ext.mjs';

import { type ChatCompletionMessage } from '~/shared/llm';
import { type ThreadMessage } from '~/shared/threads';
import { type MessageRole } from '~/shared/types';

export function convertThreadMessagesToChatCompletionMessages(
  systemPrompt: string,
  threadMessages: ThreadMessage[]
): ChatCompletionMessage[] {
  const results: ChatCompletionMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
  ];
  for (const threadMessage of threadMessages) {
    if (threadMessage.content) {
      const role: MessageRole =
        threadMessage.role === 'tool' ? 'user' : threadMessage.role;
      results.push({
        role,
        content: threadMessage.content,
      });
    }
  }
  return results;
}

export async function* bufferChunks(
  chunks: AsyncIterable<ChatCompletionChunk>,
  prefix: string
): AsyncIterable<string> {
  let buffer = '';
  for await (const chunk of chunks) {
    const content = chunk.choices[0]?.delta.content ?? '';
    buffer += content;
    while (buffer.length >= prefix.length) {
      const index = buffer.indexOf(prefix);
      if (index >= 0) {
        // Found the string, yield the chunk up to and including the found string
        yield buffer.substring(0, index + prefix.length);
        // Remove the yielded part from the buffer
        buffer = buffer.substring(index + prefix.length);
      } else {
        // Didn't find the string, yield the chunk up to the last possible start of the string
        yield buffer.substring(0, buffer.length - prefix.length + 1);
        // Remove the yielded part from the buffer
        buffer = buffer.substring(buffer.length - prefix.length + 1);
      }
    }
  }
  // Yield the remaining buffer
  if (buffer.length > 0) {
    yield buffer;
  }
}

export async function readChunksUntil(
  chunks: AsyncIterable<string>,
  postfix: string
): Promise<string> {
  let buffer = '';
  for await (const chunk of chunks) {
    buffer += chunk;
    const pos = buffer.indexOf(postfix);
    if (pos !== -1) {
      const jsonRaw = buffer.substring(0, pos);
      return jsonRaw;
    }
  }
  throw new Error('Unable to parse tool.');
}

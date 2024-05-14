import { type ChatCompletionChunk } from 'groq-sdk/lib/chat_completions_ext.mjs';

import { type ChatCompletionMessage } from '~/shared/llm';
import { applyPromptTemplate } from '~/shared/prompts/prompt-template';
import {
  type ChunkMessage,
  type Thread,
  type ThreadMessage,
  type TextMessage,
  type ToolMessage,
  type UpdateMessage,
} from '~/shared/thread';
import { type MessageRole } from '~/shared/types';
import { generateNanoId } from '~/shared/utils/nanoid';

// eslint-disable-next-line import/order
import { createChatCompletionStream } from '../llm/create-chat-completion';

// eslint-disable-next-line import/order
import SYSTEM_PROMPT from '~/prompts/system-prompt.md';
import { SearchTool } from '../tools';

const TOOL_MESSAGE_PREFIX = '```tool\n';
const TOOL_MESSAGE_POSTFIX = '\n```';

export class ServerThread implements Thread {
  constructor(readonly id: string, readonly createdTime: number = Date.now()) {}

  readonly messages: ThreadMessage[] = [];

  appendMessage(message: ThreadMessage) {
    this.messages.push(message);
  }

  async *run(): AsyncGenerator<ChunkMessage> {
    const messages = this._buildMessages();
    const { streamedChunks } = await createChatCompletionStream({
      messages,
    });
    const bufferedChunks = bufferChunks(streamedChunks, TOOL_MESSAGE_PREFIX);
    let newMessage: ThreadMessage | null = null;
    const appendedMessages: ThreadMessage[] = [];
    for await (const chunk of bufferedChunks) {
      if (chunk === TOOL_MESSAGE_PREFIX) {
        // Tool message
        const jsonRaw = await getToolContent(bufferedChunks);
        if (jsonRaw) {
          const json = JSON.parse(jsonRaw);
          if (Array.isArray(json) && json.length > 1) {
            const toolName = json[0];
            const params = json.slice(1);
            const newToolMessage: ToolMessage = {
              id: generateNanoId(),
              type: 'tool',
              role: 'tool',
              tool: {
                toolName,
                params,
                state: 'running',
                response: null,
              },
            };
            newMessage = newToolMessage;
            appendedMessages.push(newMessage);
            // Yield new tool message.
            yield newMessage;

            const tool = new SearchTool();
            let toolUpdateMessage: UpdateMessage<ToolMessage> = {
              id: newToolMessage.id,
              type: 'update',
              update: {
                tool: { toolName, state: 'running', params },
              },
            };
            yield toolUpdateMessage;

            try {
              const { response, content } = await tool.run(params);
              toolUpdateMessage = {
                id: newToolMessage.id,
                type: 'update',
                update: {
                  tool: { toolName, state: 'done', params, response },
                  content,
                },
              };
              yield toolUpdateMessage;
            } catch (e) {
              toolUpdateMessage = {
                id: newToolMessage.id,
                type: 'update',
                update: {
                  tool: { toolName, state: 'error', params },
                  content: `Error: ${
                    e instanceof Error ? e.message : 'unknown error'
                  }`,
                },
              };
              yield toolUpdateMessage;
              console.error(e);
            }
          }
          break;
        }
      } else {
        // Text
        if (!newMessage) {
          const newTextMessage: TextMessage = {
            id: generateNanoId(),
            type: 'text',
            role: 'assistant',
            content: chunk,
          };
          newMessage = newTextMessage;
          appendedMessages.push(newMessage);
          // Yield new text message.
          yield newMessage;
        } else {
          newMessage.content += chunk;
          // Yield delta chunk of text message.
          yield {
            id: newMessage.id,
            type: 'delta',
            delta: {
              content: chunk,
            },
          };
        }
      }
    }
    console.info(appendedMessages);
  }

  private _buildMessages(): ChatCompletionMessage[] {
    const prompt = applyPromptTemplate(SYSTEM_PROMPT, {
      TIME: new Date(),
      LOCATION: 'Beijing, Beijing, China',
    });
    const messages: ChatCompletionMessage[] = [
      {
        role: 'system',
        content: prompt,
      },
    ];
    const threadMessages = this.messages;
    for (const threadMessage of threadMessages) {
      if (threadMessage.type === 'text') {
        const role: MessageRole =
          threadMessage.role === 'tool' ? 'user' : threadMessage.role;
        messages.push({
          role,
          content: threadMessage.content,
        });
      }
    }
    return messages;
  }
}

async function* bufferChunks(
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

async function getToolContent(chunks: AsyncIterable<string>) {
  let buffer = '';
  for await (const chunk of chunks) {
    buffer += chunk;
    const pos = buffer.indexOf(TOOL_MESSAGE_POSTFIX);
    if (pos !== -1) {
      return buffer.substring(0, pos);
    }
  }
}

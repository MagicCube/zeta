import { type ChatCompletionMessage } from '~/shared/llm';
import { type ThreadMessage, type Thread } from '~/shared/thread';
import { type MessageRole } from '~/shared/types';
import { generateNanoId } from '~/shared/utils/nanoid';

// eslint-disable-next-line import/order
import { createChatCompletionStream } from '../llm';

// eslint-disable-next-line import/order
import SYSTEM_PROMPT from '~/prompts/system-prompt.md';

const TOOL_MESSAGE_PREFIX = '```tool\n';

export class ServerThread implements Thread {
  constructor(readonly id: string, readonly createdTime: number = Date.now()) {}

  readonly messages: ThreadMessage[] = [];

  appendMessage(message: ThreadMessage) {
    this.messages.push(message);
  }

  async *run() {
    const messages = this._buildMessages();
    const { chunks } = await createChatCompletionStream({ messages });
    let messageType: 'text' | 'tool' | null = null;
    let buffer = '';
    let threadMessage: ThreadMessage | null = null;
    for await (const chunk of chunks) {
      const chunkContent = chunk.choices[0]?.delta.content;
      if (chunkContent) {
        buffer += chunkContent;
        if (
          messageType === null &&
          buffer.length > TOOL_MESSAGE_PREFIX.length
        ) {
          if (buffer.startsWith(TOOL_MESSAGE_PREFIX)) {
            // tools
            messageType = 'tool';
          } else {
            // text
            messageType = 'text';
            threadMessage = {
              id: generateNanoId(),
              type: 'text',
              role: 'assistant',
              content: buffer,
            };
            buffer = '';
            yield threadMessage;
          }
        }
        if (messageType === 'text' && buffer) {
          threadMessage!.content += buffer;
          buffer = '';
          yield threadMessage;
        }
      }
    }
    if (messageType === null && buffer) {
      // If the text message length is shorter than TOOL_MESSAGE_PREFIX
      threadMessage = {
        id: generateNanoId(),
        type: 'text',
        role: 'assistant',
        content: buffer,
      };
      yield threadMessage;
    } else if (messageType === 'tool') {
      // tools
      threadMessage = {
        id: generateNanoId(),
        type: 'tool',
        role: 'tool',
        content: buffer,
        tool: {
          toolName: 'search',
          params: ['haha'],
          state: 'init',
          response: null,
        },
      };
      yield threadMessage;
    }
  }

  private _buildMessages(): ChatCompletionMessage[] {
    const messages: ChatCompletionMessage[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
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

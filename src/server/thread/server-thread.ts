import {
  type ChunkMessage,
  type Thread,
  type ThreadMessage,
  type TextMessage,
  type ToolMessage,
  type UpdateMessage,
  type DeltaMessage,
} from '~/shared/thread';

import { createChatCompletionStream } from '../llm';
import { type ToolRequest, callTool, type ToolResponse } from '../tools';

import {
  convertThreadMessagesToChatCompletionMessages,
  bufferChunks,
  createToolMessage,
  createTextMessage,
  readChunksUntil,
} from './utils';

const TOOL_MESSAGE_PREFIX = '```tool\n';
const TOOL_MESSAGE_POSTFIX = '\n```';

export class ServerThread implements Thread {
  constructor(readonly id: string, readonly createdTime: number = Date.now()) {}

  readonly messages: ThreadMessage[] = [];

  appendMessage(message: ThreadMessage) {
    this.messages.push(message);
  }

  async *run(): AsyncGenerator<ChunkMessage> {
    const messages = convertThreadMessagesToChatCompletionMessages(
      this.messages
    );
    const { streamedChunks } = await createChatCompletionStream({
      messages,
    });
    const bufferedChunks = bufferChunks(streamedChunks, TOOL_MESSAGE_PREFIX);
    let currentMessage: ThreadMessage | null = null;

    const appendMessage = (message: ThreadMessage) => {
      currentMessage = message;
      this.appendMessage(currentMessage);
      return currentMessage;
    };

    for await (const chunk of bufferedChunks) {
      if (chunk === TOOL_MESSAGE_PREFIX) {
        // Tool message
        const toolRequest = await readToolRequest(bufferedChunks);
        yield appendMessage(createToolMessage(toolRequest));
        // Run tool
        const toolResponse = await callTool(toolRequest);
        yield this._updateToolMessage(
          currentMessage as unknown as ToolMessage,
          toolResponse
        );
        break;
      } else {
        // Text
        if (!currentMessage) {
          yield appendMessage(createTextMessage(chunk));
        } else {
          yield this._updateTextMessage(currentMessage, chunk);
        }
      }
    }
  }

  private _updateTextMessage(
    message: TextMessage,
    deltaContent: string
  ): DeltaMessage {
    message.content += deltaContent;
    return {
      id: message.id,
      type: 'delta',
      delta: {
        content: deltaContent,
      },
    };
  }

  private _updateToolMessage(
    message: ToolMessage,
    response: ToolResponse
  ): UpdateMessage<ToolMessage> {
    Object.assign(message, response);
    return {
      id: message.id,
      type: 'update',
      update: response,
    };
  }
}

async function readToolRequest(
  chunks: AsyncIterable<string>
): Promise<ToolRequest> {
  try {
    const jsonRaw = await readChunksUntil(chunks, TOOL_MESSAGE_POSTFIX);
    const json = JSON.parse(jsonRaw);
    if (Array.isArray(json) && json.length > 1) {
      return {
        toolName: json[0],
        params: json.slice(1),
      };
    }
  } catch (e) {
    console.error(e);
  }
  throw new Error('Unable to parse tool.');
}

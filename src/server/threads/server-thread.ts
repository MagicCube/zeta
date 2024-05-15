import {
  type ChunkMessage,
  type ThreadMessage,
  type TextMessage,
  type ToolMessage,
  type UpdateMessage,
  type DeltaMessage,
  AbstractThread,
} from '~/shared/threads';

import { createChatCompletionStream } from '../llm';
import { type ToolRequest, callTool, type ToolResponse } from '../tools';

import {
  convertThreadMessagesToChatCompletionMessages,
  bufferChunks,
  readChunksUntil,
} from './utils';

const TOOL_MESSAGE_PREFIX = '```tool\n';
const TOOL_MESSAGE_POSTFIX = '\n```';

export class ServerThread extends AbstractThread {
  async *run(): AsyncGenerator<ChunkMessage> {
    this.running = true;
    try {
      yield* this._run();
      if (
        this.lastMessage?.type === 'tool' &&
        this.lastMessage.state === 'done' &&
        this.lastMessage.content
      ) {
        yield* this._run();
      }
    } finally {
      this.running = false;
    }
  }

  private async *_run(): AsyncGenerator<ChunkMessage> {
    const messages = convertThreadMessagesToChatCompletionMessages(
      this.messages
    );
    const { streamedChunks } = await createChatCompletionStream({
      messages,
    });
    const bufferedChunks = bufferChunks(streamedChunks, TOOL_MESSAGE_PREFIX);
    let currentMessage: ThreadMessage | null = null;

    const appendNewMessage = (message: ThreadMessage) => {
      currentMessage = message;
      this.appendMessage(currentMessage);
      return currentMessage;
    };

    for await (const chunk of bufferedChunks) {
      if (chunk === TOOL_MESSAGE_PREFIX) {
        // Tool message
        const toolRequest = await readToolRequest(bufferedChunks);
        yield appendNewMessage(this.createToolMessage(toolRequest));
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
          yield appendNewMessage(this.createTextMessage(chunk, 'assistant'));
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
    this.updateMessageWithDeltaContent(message.id, deltaContent);
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
    this.updateMessage(message.id, response);
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

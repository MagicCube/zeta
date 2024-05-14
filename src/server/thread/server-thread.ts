import {
  type ChunkMessage,
  type Thread,
  type ThreadMessage,
  type TextMessage,
  type ToolMessage,
  type UpdateMessage,
  type DeltaMessage,
} from '~/shared/thread';
import { extractErrorMessage } from '~/shared/utils/error';

import { createChatCompletionStream } from '../llm';
import { SearchTool } from '../tools';

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
    let newMessage: ThreadMessage | null = null;
    for await (const chunk of bufferedChunks) {
      if (chunk === TOOL_MESSAGE_PREFIX) {
        // Tool message
        const { toolName, params } = await readToolRequest(bufferedChunks);
        const newToolMessage = createToolMessage(toolName, params);
        newMessage = newToolMessage;
        this.appendMessage(newMessage);
        yield newMessage;

        const tool = new SearchTool();
        yield this._updateToolMessage(newToolMessage, 'running');

        try {
          const { response, content } = await tool.run(params);
          yield this._updateToolMessage(
            newToolMessage,
            'done',
            content,
            response
          );
        } catch (e) {
          console.error(e);
          yield this._updateToolMessage(
            newToolMessage,
            'error',
            extractErrorMessage(e)
          );
        }
        break;
      } else {
        // Text
        if (!newMessage) {
          const newTextMessage = createTextMessage(chunk);
          newMessage = newTextMessage;
          this.appendMessage(newMessage);
          yield newMessage;
        } else {
          // Yield delta chunk of text message.
          yield this._updateTextMessage(newMessage, chunk);
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

  private _updateToolMessage<T>(
    message: ToolMessage,
    state: ToolMessage['state'],
    content?: string,
    response?: T
  ): UpdateMessage<ToolMessage> {
    message.state = state;
    message.response = response;
    return {
      id: message.id,
      type: 'update',
      update: {
        state,
        content,
        response,
      },
    };
  }
}

async function readToolRequest(chunks: AsyncIterable<string>): Promise<{
  toolName: string;
  params: string[];
}> {
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

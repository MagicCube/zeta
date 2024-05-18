import PROMPT_STEP_1 from '~/prompts/step-1.md';
import PROMPT_STEP_2 from '~/prompts/step-2.md';
import { applyPromptTemplate } from '~/shared/prompts';
import { BufferedBlockTransformer } from '~/shared/stream/BufferedBlockTransformer';
import { BufferedLineTransformer } from '~/shared/stream/BufferedLineTransformer';
import { convertStreamToAsyncGenerator } from '~/shared/stream/convert-stream-to-generator';
import {
  type EventMessage,
  type ThreadMessage,
  type TextMessage,
  type ToolMessage,
  type UpdateMessage,
  type DeltaMessage,
  AbstractThread,
} from '~/shared/threads';

import { createChatCompletionStream } from '../llm';
import {
  type ToolRequest,
  callTool,
  type ToolResponse,
  TOOL_MESSAGE_POSTFIX,
  TOOL_MESSAGE_PREFIX,
  parseToolRequest,
} from '../tools';

import { convertThreadMessagesToChatCompletionMessages } from './utils';

export class ServerThread extends AbstractThread {
  async *run(): AsyncGenerator<EventMessage> {
    this.running = true;
    try {
      let prompt = applyPromptTemplate(PROMPT_STEP_1, {
        TIME: new Date(),
        LOCATION: 'Beijing, Beijing, China',
      });
      yield* this._run(prompt);
      if (
        this.lastMessage?.type === 'tool' &&
        this.lastMessage.state === 'done' &&
        this.lastMessage.content
      ) {
        prompt = applyPromptTemplate(PROMPT_STEP_2, {
          TIME: new Date(),
          LOCATION: 'Beijing, Beijing, China',
        });
        yield* this._run(prompt);
      }
    } finally {
      this.running = false;
    }
  }

  private async *_run(systemPrompt: string): AsyncGenerator<EventMessage> {
    const messages = convertThreadMessagesToChatCompletionMessages(
      systemPrompt,
      this.messages
    );
    const { stream } = await createChatCompletionStream({
      messages,
    });
    const transformedStream = transformStream(stream);
    const generator = convertStreamToAsyncGenerator(transformedStream);
    let currentMessage: ThreadMessage | null = null;
    const appendNewMessage = (message: ThreadMessage) => {
      currentMessage = message;
      this.appendMessage(currentMessage);
      return currentMessage;
    };
    for await (const chunk of generator) {
      if (
        chunk.startsWith(TOOL_MESSAGE_PREFIX) &&
        chunk.endsWith(TOOL_MESSAGE_POSTFIX)
      ) {
        // Tool
        const toolRequest = parseToolRequest(chunk);
        yield appendNewMessage(this.createToolMessage(toolRequest));
        // Run tool
        const toolResponse = await callTool(toolRequest);
        postProcessToolResponse(toolRequest, toolResponse);
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

function transformStream(stream: ReadableStream) {
  return stream
    .pipeThrough(
      new TransformStream(
        new BufferedLineTransformer(TOOL_MESSAGE_PREFIX.length)
      )
    )
    .pipeThrough(
      new TransformStream(
        new BufferedBlockTransformer(TOOL_MESSAGE_PREFIX, TOOL_MESSAGE_POSTFIX)
      )
    );
}

function postProcessToolResponse(_: ToolRequest, toolResponse: ToolResponse) {
  if (toolResponse.content) {
    toolResponse.content +=
      '\n# Constraints\n- 你的默认语言是简体中文，因此你必须的答案主体是中文的，除非用户要求使用其他的语言。';
  }
}

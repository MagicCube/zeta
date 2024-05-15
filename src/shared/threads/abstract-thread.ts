import { type ToolRequest } from '~/server/tools';

import { generateNanoId } from '../utils/nanoid';

import { type ThreadMessage, type ToolMessage } from './messages';
import { type Thread } from './thread';

export class AbstractThread implements Thread {
  readonly id: string;
  readonly createdTime: number;
  readonly messages: ThreadMessage[];

  constructor({
    id = generateNanoId(),
    createdTime = Date.now(),
    messages = [],
  }: Partial<Thread> = {}) {
    this.id = id;
    this.createdTime = createdTime;
    this.messages = messages;
  }

  get lastMessage() {
    return this.messages[this.messages.length - 1];
  }

  findMessage(id: string) {
    return this.messages.find((m) => m.id === id);
  }

  createTextMessage(
    content: string,
    role: 'user' | 'assistant'
  ): ThreadMessage {
    return {
      type: 'text',
      id: generateNanoId(),
      role,
      content,
    };
  }

  createToolMessage({ toolName, params }: ToolRequest): ToolMessage {
    return {
      id: generateNanoId(),
      type: 'tool',
      role: 'tool',
      toolName,
      params,
      state: 'running',
      data: null,
    };
  }

  appendMessage(message: ThreadMessage) {
    this.messages.push(message);
  }

  updateMessage(id: string, changes: Partial<ThreadMessage>): void {
    const message = this.findMessage(id);
    if (message) {
      Object.assign(message, changes);
    }
  }

  updateMessageWithDeltaContent(id: string, delta: string): void {
    const message = this.findMessage(id);
    if (message) {
      message.content += delta;
    }
  }

  toJSON() {
    return {
      id: this.id,
      createdTime: this.createdTime,
      messages: this.messages,
    };
  }
}

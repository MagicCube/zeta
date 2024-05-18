import {
  AbstractThread,
  type EventMessage,
  type ThreadMessage,
} from '~/shared/threads';

import { fetchStreamEvents } from '../sse';

export class ClientThread extends AbstractThread {
  async sendMessage(content: string) {
    const textMessage = this.createTextMessage(content, 'user');
    this.appendMessage(textMessage);
    await this.run();
  }

  protected async run() {
    this.running = true;
    try {
      const events = fetchStreamEvents('/api/threads/run', {
        body: JSON.stringify(this.toJSON()),
      });
      for await (const event of events) {
        if (event.type === 'message') {
          const json = JSON.parse(event.data) as unknown as EventMessage;
          this._handleIncomingMessage(json);
        }
      }
    } finally {
      this.running = false;
    }
  }

  private _handleIncomingMessage(message: EventMessage) {
    if (message.type === 'text' || message.type === 'tool') {
      this.appendMessage(message);
    } else if (message.type === 'delta' && message.delta.content) {
      this.updateMessageWithDeltaContent(message.id, message.delta.content);
    } else if (message.type === 'update') {
      this.updateMessage(message.id, message.update as Partial<ThreadMessage>);
    }
  }
}

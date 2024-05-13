import { type MessageRole } from '../../types';

export interface ChatCompletionMessage {
  role: MessageRole;
  content: string;
}

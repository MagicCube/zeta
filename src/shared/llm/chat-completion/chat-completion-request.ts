import { type ChatCompletionMessage } from './chat-completion-message';

export interface ChatCompletionRequest {
  model: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
  seed: number;

  messages: ChatCompletionMessage[];
}

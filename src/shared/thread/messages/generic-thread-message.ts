export interface GenericThreadMessage<T extends string> {
  type: T;
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content?: string;
}

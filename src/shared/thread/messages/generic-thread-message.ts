export interface GenericThreadMessage<T extends string = string> {
  type: T;
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content?: string;
}

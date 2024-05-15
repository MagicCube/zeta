import { type GenericThreadMessage } from './generic-thread-message';

export interface ToolMessage<T = unknown> extends GenericThreadMessage<'tool'> {
  role: 'tool';
  toolName: string;
  params: string[];
  state: 'init' | 'running' | 'done' | 'error';
  data?: T | undefined;
}

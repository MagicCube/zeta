import { type ToolRuntime } from '../../tools';

import { type GenericThreadMessage } from './generic-thread-message';

export interface ToolMessage<R = unknown> extends GenericThreadMessage<'tool'> {
  role: 'tool';
  tool: ToolRuntime<R>;
}

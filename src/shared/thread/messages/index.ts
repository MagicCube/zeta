import { type TextMessage } from './text-message';
import { type ToolMessage } from './tool-message';

export * from './text-message';
export * from './tool-message';

export type ThreadMessage = TextMessage | ToolMessage;

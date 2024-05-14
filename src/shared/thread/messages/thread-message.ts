import { type DeltaMessage } from './delta-message';
import { type TextMessage } from './text-message';
import { type ToolMessage } from './tool-message';
import { type UpdateMessage } from './update-message';

export type ThreadMessage = TextMessage | ToolMessage;
export type ChunkMessage = DeltaMessage | UpdateMessage | ThreadMessage;

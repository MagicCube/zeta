import { type GenericThreadMessage } from './generic-thread-message';

export interface DeltaMessage {
  id: string;
  type: 'delta';
  delta: Partial<GenericThreadMessage>;
}

import { type GenericThreadMessage } from './generic-thread-message';

export interface TextMessage extends GenericThreadMessage<'text'> {
  content: string;
}

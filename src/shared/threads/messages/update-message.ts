import { type GenericThreadMessage } from './generic-thread-message';

export interface UpdateMessage<
  T extends GenericThreadMessage = GenericThreadMessage
> {
  id: string;
  type: 'update';
  update: Partial<T>;
}

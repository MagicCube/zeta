import { type ThreadMessage } from './messages';

export interface Thread {
  id: string;
  createdTime: number;
  messages: ThreadMessage[];
}

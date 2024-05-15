import { type ThreadMessage } from './messages';

export interface Thread {
  id: string;
  running?: boolean;
  createdTime: number;
  messages: ThreadMessage[];
}

import { proxy, subscribe, useSnapshot } from 'valtio';

import { type Thread } from '~/shared/threads';

import { ClientThread } from '../threads';

export interface ThreadStoreState {
  activeThread: ClientThread;
}

const state = proxy<ThreadStoreState>({
  activeThread: createThread(),
});

subscribe(state, () => {
  console.log('Thread store updated:', JSON.parse(JSON.stringify(state)));
});

export function useActiveThread(): Thread {
  return useSnapshot(state.activeThread) as ClientThread;
}

export function getActiveThread(): ClientThread {
  return state.activeThread;
}

export function createThread() {
  const thread = proxy(new ClientThread());
  return thread;
}

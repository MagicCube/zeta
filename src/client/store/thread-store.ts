import { proxy, subscribe, useSnapshot } from 'valtio';

import { type Thread } from '~/shared/threads';

import { ClientThread } from '../threads';

export interface ThreadStoreState {
  activeThread: ClientThread;
}

const state = proxy<ThreadStoreState>({
  activeThread: createThread(),
});

function setup() {
  const jsonRaw = localStorage.getItem('zeta.threads.active');
  if (jsonRaw) {
    const json = JSON.parse(jsonRaw);
    state.activeThread = proxy(new ClientThread(json));
  }
  subscribe(state, () => {
    localStorage.setItem(
      'zeta.threads.active',
      JSON.stringify(state.activeThread)
    );
  });
}
setup();

export function useActiveThread(): Thread {
  return useSnapshot(state).activeThread as ClientThread;
}

export function getActiveThread(): ClientThread {
  return state.activeThread;
}

export function createThread() {
  const thread = proxy(new ClientThread());
  return thread;
}

export function activateThread(thread: ClientThread) {
  state.activeThread = thread;
}

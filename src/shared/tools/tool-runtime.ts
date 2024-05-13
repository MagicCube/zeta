export interface ToolRuntime<R> {
  toolName: string;
  params: string[];
  state: 'init' | 'running' | 'done' | 'error';
  response?: R | undefined;
}

export interface Tool<R = unknown> {
  readonly name: string;
  run(params: string[]): Promise<{
    response: R;
    content: string;
  }>;
}

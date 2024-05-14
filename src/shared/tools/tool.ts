export interface Tool<T = unknown> {
  readonly name: string;

  run(params: string[]): Promise<{
    data: T;
    content: string;
  }>;
}

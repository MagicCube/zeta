export class LineByLineTransformer implements Transformer<string, string> {
  private buffer = '';

  transform(
    chunk: string,
    controller: TransformStreamDefaultController<string>
  ) {
    this.buffer += chunk;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() ?? '';
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller: TransformStreamDefaultController<string>) {
    if (this.buffer) {
      controller.enqueue(this.buffer);
    }
  }
}

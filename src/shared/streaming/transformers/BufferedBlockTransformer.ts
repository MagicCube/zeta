export class BufferedBlockTransformer implements Transformer<string, string> {
  private buffer = '';
  private buffering = false;

  constructor(readonly startLine: string, readonly endLine: string) {}

  transform(chunk: string, controller: TransformStreamDefaultController<string>) {
    if (!this.buffering) {
      if (chunk === this.startLine || chunk === '\n' + this.startLine) {
        this.buffering = true;
        if (chunk === '\n' + this.startLine) {
          controller.enqueue('\n');
        }
        this.buffer = this.startLine;
      } else {
        controller.enqueue(chunk);
      }
    } else {
      this.buffer += chunk;
      if (chunk === this.endLine || chunk === '\n' + this.endLine) {
        this.buffering = false;
        controller.enqueue(this.buffer);
        this.buffer = '';
      }
    }
  }

  flush(controller: TransformStreamDefaultController<string>) {
    if (this.buffer.length > 0) {
      controller.enqueue(this.buffer);
      this.buffer = '';
    }
  }
}

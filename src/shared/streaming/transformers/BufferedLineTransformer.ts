const SYMBOL = '\x00';

export class BufferedLineTransformer implements Transformer<string, string> {
  private buffer = '';
  private doNotAddNewLine = true;

  constructor(readonly lineBufferSize: number) {}

  transform(
    chunk: string,
    controller: TransformStreamDefaultController<string>
  ) {
    this.buffer += chunk;
    const lines = this.buffer.split('\n');
    const lastLine = lines.pop()!;
    if (lastLine.length < this.lineBufferSize) {
      this.buffer = lastLine;
    } else {
      lines.push(lastLine + SYMBOL);
      this.buffer = '';
    }

    for (const line of lines) {
      if (this.doNotAddNewLine) {
        controller.enqueue(line.replace(SYMBOL, ''));
        this.doNotAddNewLine = false;
      } else {
        controller.enqueue('\n' + line.replace(SYMBOL, ''));
      }

      if (line.endsWith(SYMBOL)) {
        this.doNotAddNewLine = true;
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

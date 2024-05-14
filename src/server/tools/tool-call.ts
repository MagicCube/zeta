import { type ToolMessage } from '~/shared/thread';
import { extractErrorMessage } from '~/shared/utils/error';

import { SearchTool } from '.';

export interface ToolRequest {
  toolName: string;
  params: string[];
}

export interface ToolResponse {
  state: ToolMessage['state'];
  content?: string;
  data?: unknown;
}

export async function callTool({
  toolName,
  params,
}: ToolRequest): Promise<ToolResponse> {
  let ToolClass: typeof SearchTool | undefined;
  if (toolName) {
    ToolClass = SearchTool;
  }
  if (!ToolClass) {
    return { state: 'error', content: `Tool not found: ${toolName}` };
  }
  const tool = new ToolClass();
  try {
    const res = await tool.run(params);
    return { state: 'done', ...res };
  } catch (e) {
    return { state: 'error', content: extractErrorMessage(e) };
  }
}

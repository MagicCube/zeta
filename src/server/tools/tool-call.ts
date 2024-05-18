import { type ToolMessage } from '~/shared/threads';
import { extractErrorMessage } from '~/shared/utils/error';

import { SearchTool } from '.';

export const TOOL_MESSAGE_PREFIX = '```tool';
export const TOOL_MESSAGE_POSTFIX = '```';

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

export function parseToolRequest(block: string): ToolRequest {
  const rawJSON = block.slice(
    TOOL_MESSAGE_PREFIX.length,
    block.length - TOOL_MESSAGE_POSTFIX.length
  );
  const json = JSON.parse(rawJSON) as ToolRequest;
  if (Array.isArray(json) && json.length >= 1) {
    const [toolName, ...params] = json;
    return {
      toolName,
      params,
    };
  }
  throw new Error('Invalid tool request');
}

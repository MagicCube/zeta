import { HttpsProxyAgent } from 'https-proxy-agent';

export function createHTTPAgentIfConfigured() {
  if (process.env.HTTP_PROXY) {
    const agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
    return agent;
  }
  return null;
}

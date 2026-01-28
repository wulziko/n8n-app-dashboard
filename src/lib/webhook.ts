import { WebhookResponse } from '@/types/tool';

export async function callN8nWebhook(
  webhookUrl: string,
  data: Record<string, any>,
  timeoutMs: number = 300000
): Promise<WebhookResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout - webhook took too long to respond',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to call webhook',
    };
  }
}

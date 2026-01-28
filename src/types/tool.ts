export interface ToolInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }> | string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  webhookUrl: string;
  inputs: ToolInput[];
}

export interface ToolsConfig {
  tools: Tool[];
}

export interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

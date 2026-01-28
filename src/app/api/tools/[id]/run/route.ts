import { NextRequest, NextResponse } from 'next/server';
import toolsConfig from '@/config/tools.json';
import { callN8nWebhook } from '@/lib/webhook';
import { Tool } from '@/types/tool';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Find the tool in config
    const tool = toolsConfig.tools.find((t) => t.id === id) as Tool | undefined;

    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Validate required inputs
    for (const input of tool.inputs) {
      if (input.required && !body[input.name]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${input.label}` },
          { status: 400 }
        );
      }
    }

    // Call the n8n webhook
    const result = await callN8nWebhook(tool.webhookUrl, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error('Error running tool:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

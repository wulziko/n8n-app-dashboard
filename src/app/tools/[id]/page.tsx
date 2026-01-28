'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toolsConfig from '@/config/tools.json';
import { Tool, WebhookResponse } from '@/types/tool';
import { DynamicForm } from '@/components/DynamicForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ToolPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebhookResponse | null>(null);

  const toolId = Array.isArray(params.id) ? params.id[0] : params.id;
  const tool = toolsConfig.tools.find((t) => t.id === toolId) as Tool | undefined;

  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Tool Not Found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/tools/${tool.id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setResult(result);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Failed to execute workflow',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Tool Card */}
        <Card>
          <CardHeader>
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicForm tool={tool} onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Result Display */}
        <ResultDisplay result={result} />
      </div>
    </div>
  );
}

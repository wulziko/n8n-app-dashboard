'use client';

import { WebhookResponse } from '@/types/tool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ResultDisplayProps {
  result: WebhookResponse | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {result.success ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Success
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                Error
              </>
            )}
          </CardTitle>
          <Badge variant={result.success ? "default" : "destructive"}>
            {result.success ? "Completed" : "Failed"}
          </Badge>
        </div>
        <CardDescription>
          {result.success
            ? "Your workflow executed successfully"
            : "There was an error executing your workflow"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result.success ? (
          <div className="space-y-2">
            {result.message && (
              <p className="text-sm text-muted-foreground">{result.message}</p>
            )}
            {result.data && (
              <pre className="mt-4 rounded-lg bg-slate-950 p-4 overflow-auto">
                <code className="text-xs text-slate-50">
                  {JSON.stringify(result.data, null, 2)}
                </code>
              </pre>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800 font-medium">
              {result.error || "An unknown error occurred"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { BannerGallery } from './BannerGallery'
import { WebhookResponse } from '@/types/tool'

interface ResultDisplayProps {
  result: WebhookResponse | null
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) return null

  // Check if result contains banner data
  const isBannerResult = result.data && Array.isArray(result.data)
  const hasBanners = isBannerResult && result.data.some((item: any) =>
    item.imageUrl || item.data?.binary?.data
  )

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2">
        {result.success ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <Badge variant="default">Completed</Badge>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-destructive" />
            <Badge variant="destructive">Failed</Badge>
          </>
        )}
      </div>

      {result.success ? (
        <>
          {result.message && (
            <p className="text-sm text-muted-foreground">{result.message}</p>
          )}

          {hasBanners ? (
            <BannerGallery banners={result.data} />
          ) : (
            result.data && (
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )
          )}
        </>
      ) : (
        <Alert variant="destructive">
          <AlertDescription>{result.error || 'Unknown error occurred'}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

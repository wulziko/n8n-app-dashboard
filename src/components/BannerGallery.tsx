'use client'

import { useState } from 'react'
import { Download, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BannerItem {
  imageUrl?: string
  data?: {
    binary?: {
      data: string
      mimeType: string
      fileName: string
    }
  }
  index?: number
}

interface BannerGalleryProps {
  banners: BannerItem[]
}

export function BannerGallery({ banners }: BannerGalleryProps) {
  const [downloadedItems, setDownloadedItems] = useState<Set<number>>(new Set())

  const handleDownload = async (banner: BannerItem, index: number) => {
    try {
      let imageUrl: string | undefined
      let fileName = `banner-${index + 1}.png`

      // Handle different response formats
      if (banner.imageUrl) {
        imageUrl = banner.imageUrl
      } else if (banner.data?.binary?.data) {
        // Convert base64 to blob URL
        const base64Data = banner.data.binary.data
        const mimeType = banner.data.binary.mimeType || 'image/png'
        fileName = banner.data.binary.fileName || fileName

        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: mimeType })
        imageUrl = URL.createObjectURL(blob)
      }

      if (!imageUrl) {
        console.error('No valid image URL found')
        return
      }

      // Download the file
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Mark as downloaded
      setDownloadedItems(prev => new Set(prev).add(index))

      // Clean up blob URL if created
      if (banner.data?.binary?.data) {
        setTimeout(() => URL.revokeObjectURL(imageUrl!), 1000)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDownloadAll = () => {
    banners.forEach((banner, index) => {
      setTimeout(() => handleDownload(banner, index), index * 500)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Generated Banners</h3>
          <p className="text-sm text-muted-foreground">
            {banners.length} banner{banners.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <Button onClick={handleDownloadAll} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner, index) => {
          const imageUrl = banner.imageUrl ||
            (banner.data?.binary?.data
              ? `data:${banner.data.binary.mimeType};base64,${banner.data.binary.data}`
              : undefined)

          const isDownloaded = downloadedItems.has(index)

          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Banner {index + 1}</CardTitle>
                  {isDownloaded && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Downloaded
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {imageUrl ? (
                  <div className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(banner, index)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      {banner.imageUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(banner.imageUrl, '_blank')}
                          className="bg-white/90 hover:bg-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No image available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

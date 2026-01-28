'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface ProgressLoaderProps {
  isActive: boolean
  estimatedDuration: number // in milliseconds
}

const STAGES = [
  { name: 'Analyzing product...', weight: 15 },
  { name: 'Researching market...', weight: 25 },
  { name: 'Generating ad concepts...', weight: 20 },
  { name: 'Creating banners...', weight: 30 },
  { name: 'Finalizing results...', weight: 10 },
]

export function ProgressLoader({ isActive, estimatedDuration }: ProgressLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      setCurrentStage(0)
      setElapsedTime(0)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      setElapsedTime(elapsed)

      // Calculate progress based on estimated duration
      const rawProgress = Math.min((elapsed / estimatedDuration) * 100, 99)
      setProgress(rawProgress)

      // Determine current stage based on progress
      let cumulativeWeight = 0
      for (let i = 0; i < STAGES.length; i++) {
        cumulativeWeight += STAGES[i].weight
        if (rawProgress < cumulativeWeight) {
          setCurrentStage(i)
          break
        }
      }
    }, 500) // Update every 500ms

    return () => clearInterval(interval)
  }, [isActive, estimatedDuration])

  if (!isActive) return null

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-6 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="font-medium">{STAGES[currentStage]?.name}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {formatTime(elapsedTime)}
        </span>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{Math.round(progress)}%</span>
          <span>Est. {formatTime(estimatedDuration - elapsedTime)} remaining</span>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        This may take up to 20 minutes for complex workflows
      </p>
    </div>
  )
}

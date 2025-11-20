/**
 * GameCardSkeleton Component
 * Loading skeleton for GameCard
 */

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface GameCardSkeletonProps {
  variant?: 'default' | 'compact'
}

export function GameCardSkeleton({ variant = 'default' }: GameCardSkeletonProps) {
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 p-3">
          <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

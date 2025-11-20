/**
 * RatingStars Component
 * Star rating display and input component
 */

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRate?: (rating: number) => void
  showCount?: boolean
}

export function RatingStars({
  rating,
  count,
  size = 'md',
  interactive = false,
  onRate,
  showCount = false,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const handleClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center gap-1">
      <div
        className={cn(
          'flex items-center gap-0.5',
          interactive && 'cursor-pointer'
        )}
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const isFilled = value <= displayRating
          const isHalf = value - 0.5 <= displayRating && value > displayRating

          return (
            <button
              key={value}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(value)}
              onMouseEnter={() => interactive && setHoverRating(value)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={cn(
                'p-0 border-0 bg-transparent',
                interactive && 'hover:scale-110 transition-transform',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : isHalf
                    ? 'fill-yellow-400/50 text-yellow-400'
                    : 'fill-muted text-muted-foreground'
                )}
              />
            </button>
          )
        })}
      </div>
      {showCount && count !== undefined && (
        <span className={cn('text-muted-foreground', textSizeClasses[size])}>
          ({count})
        </span>
      )}
    </div>
  )
}

interface RatingSummaryProps {
  avgRating: number
  ratingCount: number
  userRating?: number | null
  onRate?: (rating: number) => void
}

export function RatingSummary({
  avgRating,
  ratingCount,
  userRating,
  onRate,
}: RatingSummaryProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <RatingStars rating={avgRating} size="lg" />
        <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
        <span className="text-muted-foreground">
          ({ratingCount.toLocaleString()} ratings)
        </span>
      </div>
      {onRate && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Your rating:</span>
          <RatingStars
            rating={userRating || 0}
            interactive
            onRate={onRate}
            size="md"
          />
        </div>
      )}
    </div>
  )
}

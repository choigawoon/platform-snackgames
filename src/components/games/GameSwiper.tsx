/**
 * GameSwiper Component
 * TikTok/Shorts style vertical swipe view for games
 */

import { useState, useEffect, useRef } from 'react'
import { ChevronUp, ChevronDown, Play, Star, MessageCircle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { GameResponse } from '@/schemas'

interface GameSwiperProps {
  games: GameResponse[]
  isLoading?: boolean
  onGameChange?: (game: GameResponse) => void
}

export function GameSwiper({
  games,
  isLoading = false,
  onGameChange,
}: GameSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  const currentGame = games[currentIndex]

  useEffect(() => {
    if (currentGame) {
      onGameChange?.(currentGame)
    }
  }, [currentGame, onGameChange])

  const goToNext = () => {
    if (currentIndex < games.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      goToNext()
    } else {
      goToPrev()
    }
  }

  const categoryLabels: Record<string, string> = {
    puzzle: '퍼즐',
    action: '액션',
    education: '교육',
    entertainment: '엔터테인먼트',
    casual: '캐주얼',
    sports: '스포츠',
    strategy: '전략',
  }

  if (isLoading) {
    return (
      <div className="relative h-[calc(100vh-4rem)] w-full bg-black flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="relative h-[calc(100vh-4rem)] w-full bg-black flex items-center justify-center text-white">
        <p>게임이 없습니다.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-4rem)] w-full bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Game Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {currentGame.thumbnail ? (
          <img
            src={currentGame.thumbnail}
            alt={currentGame.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white bg-gradient-to-b from-gray-900 to-black">
            <Play className="w-24 h-24 opacity-50" />
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Game Info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 text-white">
        <Badge variant="secondary" className="mb-2">
          {categoryLabels[currentGame.category] || currentGame.category}
        </Badge>
        <h2 className="text-xl font-bold mb-2">{currentGame.title}</h2>
        <p className="text-sm text-white/80 line-clamp-2 mb-3">
          {currentGame.description}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{currentGame.avg_rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="w-4 h-4" />
            <span>{currentGame.play_count.toLocaleString()}</span>
          </div>
        </div>
        <Link to="/games/$gameId" params={{ gameId: String(currentGame.id) }}>
          <Button className="mt-4 gap-2">
            <Play className="w-4 h-4" />
            게임 플레이
          </Button>
        </Link>
      </div>

      {/* Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-4">
        <Link to="/games/$gameId" params={{ gameId: String(currentGame.id) }}>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <Star className="w-6 h-6" />
          </Button>
        </Link>
        <Link to="/games/$gameId" params={{ gameId: String(currentGame.id) }}>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
          onClick={goToPrev}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
          onClick={goToNext}
          disabled={currentIndex === games.length - 1}
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-4 text-white text-sm">
        {currentIndex + 1} / {games.length}
      </div>
    </div>
  )
}

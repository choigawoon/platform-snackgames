/**
 * GameGrid Component
 * Netflix/YouTube style grid layout for games
 */

import { GameCard } from './GameCard'
import { GameCardSkeleton } from './GameCardSkeleton'
import type { GameResponse } from '@/schemas'

interface GameGridProps {
  games: GameResponse[]
  isLoading?: boolean
  emptyMessage?: string
}

export function GameGrid({
  games,
  isLoading = false,
  emptyMessage = '게임이 없습니다.',
}: GameGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}

interface GameSectionProps {
  title: string
  games: GameResponse[]
  isLoading?: boolean
  showAll?: () => void
}

export function GameSection({
  title,
  games,
  isLoading = false,
  showAll,
}: GameSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {showAll && (
          <button
            onClick={showAll}
            className="text-sm text-primary hover:underline"
          >
            모두 보기
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>게임이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  )
}

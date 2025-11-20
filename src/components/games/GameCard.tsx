/**
 * GameCard Component
 * Displays a game card with thumbnail, title, rating, and play count
 */

import { Link } from '@tanstack/react-router'
import { Star, Play, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { GameResponse } from '@/schemas'

interface GameCardProps {
  game: GameResponse
  variant?: 'default' | 'compact'
}

export function GameCard({ game, variant = 'default' }: GameCardProps) {
  const categoryLabels: Record<string, string> = {
    puzzle: '퍼즐',
    action: '액션',
    education: '교육',
    entertainment: '엔터테인먼트',
    casual: '캐주얼',
    sports: '스포츠',
    strategy: '전략',
  }

  if (variant === 'compact') {
    return (
      <Link to="/games/$gameId" params={{ gameId: String(game.id) }}>
        <Card className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {game.thumbnail ? (
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Play className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{game.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{game.avg_rating.toFixed(1)}</span>
                </div>
                <span>·</span>
                <span>{game.play_count.toLocaleString()} plays</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link to="/games/$gameId" params={{ gameId: String(game.id) }}>
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden h-full">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {game.thumbnail ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Play className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[game.category] || game.category}
            </Badge>
          </div>
          {!game.embed_allowed && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="text-xs bg-background/80">
                <ExternalLink className="w-3 h-3 mr-1" />
                External
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">
            {game.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {game.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{game.avg_rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({game.rating_count})
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Play className="w-4 h-4" />
              <span>{game.play_count.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

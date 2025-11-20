/**
 * Memory Game Component
 * A card matching game where players find pairs of matching cards
 */

import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Trophy, Clock, MousePointer2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

// Card emojis for the game (8 pairs = 16 cards)
const CARD_EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝']

interface GameCard {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  onPlay?: () => void
}

export function MemoryGame({ onPlay }: MemoryGameProps) {
  const { t } = useTranslation()
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bestScore, setBestScore] = useState<number | null>(null)

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffledEmojis = [...CARD_EMOJIS, ...CARD_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffledEmojis)
    setFlippedCards([])
    setMoves(0)
    setIsWon(false)
    setTime(0)
    setIsPlaying(false)
  }, [])

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('memory-game-best-score')
    if (saved) {
      setBestScore(parseInt(saved, 10))
    }
    initializeGame()
  }, [initializeGame])

  // Timer
  useEffect(() => {
    let interval: number | undefined
    if (isPlaying && !isWon) {
      interval = window.setInterval(() => {
        setTime((t) => t + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, isWon])

  // Check for win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsWon(true)
      setIsPlaying(false)
      onPlay?.()

      // Save best score
      if (!bestScore || moves < bestScore) {
        setBestScore(moves)
        localStorage.setItem('memory-game-best-score', moves.toString())
      }
    }
  }, [cards, moves, bestScore, onPlay])

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!isPlaying) {
      setIsPlaying(true)
    }

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return
    }

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    )

    // Check for match when two cards are flipped
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)

      const [firstId, secondId] = newFlipped
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          )
          setFlippedCards([])
        }, 500)
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MousePointer2 className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{t('games.memory.moves', { count: moves })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{formatTime(time)}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={initializeGame} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          {t('games.memory.restart')}
        </Button>
      </div>

      {/* Best Score */}
      {bestScore !== null && (
        <div className="text-center text-sm text-muted-foreground mb-4">
          {t('games.memory.bestScore', { moves: bestScore })}
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || flippedCards.length >= 2}
            className={`
              aspect-square rounded-lg text-3xl sm:text-4xl
              transition-all duration-300 transform
              ${
                card.isFlipped || card.isMatched
                  ? 'bg-primary/10 rotate-0'
                  : 'bg-primary hover:bg-primary/90 rotate-y-180 cursor-pointer'
              }
              ${card.isMatched ? 'opacity-50' : 'opacity-100'}
              ${!card.isFlipped && !card.isMatched ? 'hover:scale-105' : ''}
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            `}
            style={{
              perspective: '1000px',
            }}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="block">{card.emoji}</span>
            ) : (
              <span className="block text-primary-foreground">?</span>
            )}
          </button>
        ))}
      </div>

      {/* Win Modal */}
      {isWon && (
        <Card className="mt-6 border-2 border-primary">
          <CardContent className="pt-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t('games.memory.congratulations')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('games.memory.completedIn', { moves, time: formatTime(time) })}
            </p>
            {bestScore === moves && (
              <p className="text-sm text-primary font-medium mb-4">
                {t('games.memory.newRecord')}
              </p>
            )}
            <Button onClick={initializeGame} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              {t('games.memory.playAgain')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!isPlaying && !isWon && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>{t('games.memory.instructions')}</p>
        </div>
      )}
    </div>
  )
}

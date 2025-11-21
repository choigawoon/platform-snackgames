/**
 * Timing Button Game Component
 * A rhythm/timing game where players press a button when the indicator is in the target zone
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw, Trophy, Zap, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

interface TimingButtonGameProps {
  onPlay?: () => void
}

type GameState = 'ready' | 'playing' | 'success' | 'failed' | 'gameover'

export function TimingButtonGame({ onPlay }: TimingButtonGameProps) {
  const { t } = useTranslation()
  const [gameState, setGameState] = useState<GameState>('ready')
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [lives, setLives] = useState(3)
  const [position, setPosition] = useState(0)
  const [direction, setDirection] = useState(1)
  const [speed, setSpeed] = useState(2)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [lastResult, setLastResult] = useState<'perfect' | 'good' | 'miss' | null>(null)

  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  // Target zone configuration (center of the bar)
  const targetZoneStart = 35
  const targetZoneEnd = 65
  const perfectZoneStart = 45
  const perfectZoneEnd = 55

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('timing-button-game-best-score')
    if (saved) {
      setBestScore(parseInt(saved, 10))
    }
  }, [])

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp
    }

    const delta = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    setPosition((prev) => {
      let newPos = prev + direction * speed * (delta / 16)

      // Bounce off edges
      if (newPos >= 100) {
        newPos = 100
        setDirection(-1)
      } else if (newPos <= 0) {
        newPos = 0
        setDirection(1)
      }

      return newPos
    })

    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [direction, speed, gameState])

  // Start/stop animation based on game state
  useEffect(() => {
    if (gameState === 'playing') {
      lastTimeRef.current = 0
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, animate])

  // Clear result message after a short delay
  useEffect(() => {
    if (lastResult) {
      const timeout = setTimeout(() => {
        setLastResult(null)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [lastResult])

  // Initialize game
  const initializeGame = useCallback(() => {
    setGameState('ready')
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setLives(3)
    setPosition(0)
    setDirection(1)
    setSpeed(2)
    setLastResult(null)
    lastTimeRef.current = 0
  }, [])

  // Start game
  const startGame = () => {
    setGameState('playing')
  }

  // Handle button press
  const handlePress = () => {
    if (gameState === 'ready') {
      startGame()
      return
    }

    if (gameState !== 'playing') return

    // Check if in target zone
    if (position >= perfectZoneStart && position <= perfectZoneEnd) {
      // Perfect hit
      const points = 100 + combo * 10
      setScore((s) => s + points)
      setCombo((c) => {
        const newCombo = c + 1
        setMaxCombo((max) => Math.max(max, newCombo))
        return newCombo
      })
      setLastResult('perfect')

      // Increase speed every 5 combos
      if ((combo + 1) % 5 === 0) {
        setSpeed((s) => Math.min(s + 0.3, 6))
      }
    } else if (position >= targetZoneStart && position <= targetZoneEnd) {
      // Good hit
      const points = 50 + combo * 5
      setScore((s) => s + points)
      setCombo((c) => {
        const newCombo = c + 1
        setMaxCombo((max) => Math.max(max, newCombo))
        return newCombo
      })
      setLastResult('good')
    } else {
      // Miss
      setCombo(0)
      setLives((l) => {
        const newLives = l - 1
        if (newLives <= 0) {
          setGameState('gameover')
          onPlay?.()

          // Save best score
          if (!bestScore || score > bestScore) {
            setBestScore(score)
            localStorage.setItem('timing-button-game-best-score', score.toString())
          }
        }
        return newLives
      })
      setLastResult('miss')
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handlePress()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, position, combo, score, bestScore])

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{t('games.timing.score', { score })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-orange-500">
              {t('games.timing.combo', { combo })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={initializeGame} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          {t('games.timing.restart')}
        </Button>
      </div>

      {/* Best Score */}
      {bestScore !== null && (
        <div className="text-center text-sm text-muted-foreground mb-4">
          {t('games.timing.bestScore', { score: bestScore })}
        </div>
      )}

      {/* Game Area */}
      <div className="relative bg-muted rounded-lg p-6 mb-4">
        {/* Timing Bar */}
        <div className="relative h-12 bg-background rounded-lg overflow-hidden border-2 border-border">
          {/* Target Zone */}
          <div
            className="absolute top-0 bottom-0 bg-green-500/30"
            style={{
              left: `${targetZoneStart}%`,
              width: `${targetZoneEnd - targetZoneStart}%`,
            }}
          />
          {/* Perfect Zone */}
          <div
            className="absolute top-0 bottom-0 bg-green-500/50"
            style={{
              left: `${perfectZoneStart}%`,
              width: `${perfectZoneEnd - perfectZoneStart}%`,
            }}
          />
          {/* Moving Indicator */}
          <div
            className="absolute top-1 bottom-1 w-2 bg-primary rounded transition-none"
            style={{
              left: `calc(${position}% - 4px)`,
            }}
          />
        </div>

        {/* Result Message */}
        {lastResult && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className={`text-2xl font-bold animate-bounce ${
                lastResult === 'perfect'
                  ? 'text-yellow-500'
                  : lastResult === 'good'
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {lastResult === 'perfect' && t('games.timing.perfect')}
              {lastResult === 'good' && t('games.timing.good')}
              {lastResult === 'miss' && t('games.timing.miss')}
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={handlePress}
        className="w-full h-16 text-xl font-bold"
        variant={gameState === 'playing' ? 'default' : 'secondary'}
        disabled={gameState === 'gameover'}
      >
        {gameState === 'ready' && t('games.timing.pressToStart')}
        {gameState === 'playing' && t('games.timing.hit')}
        {gameState === 'gameover' && t('games.timing.gameOver')}
      </Button>

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <Card className="mt-6 border-2 border-primary">
          <CardContent className="pt-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t('games.timing.gameOver')}</h3>
            <p className="text-muted-foreground mb-2">
              {t('games.timing.finalScore', { score })}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {t('games.timing.maxCombo', { combo: maxCombo })}
            </p>
            {bestScore === score && score > 0 && (
              <p className="text-sm text-primary font-medium mb-4">
                {t('games.timing.newRecord')}
              </p>
            )}
            <Button onClick={initializeGame} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              {t('games.timing.playAgain')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {gameState === 'ready' && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>{t('games.timing.instructions')}</p>
          <p className="mt-2 text-xs">{t('games.timing.keyboardHint')}</p>
        </div>
      )}
    </div>
  )
}

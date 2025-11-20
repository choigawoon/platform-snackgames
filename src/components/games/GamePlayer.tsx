/**
 * GamePlayer Component
 * iframe wrapper for embedded games with fullscreen support
 * Also supports internal games with internal:// URL scheme
 */

import { useState } from 'react'
import { Maximize2, Minimize2, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MemoryGame } from './MemoryGame'

interface GamePlayerProps {
  url: string
  title: string
  embedAllowed: boolean
  onPlay?: () => void
}

// Internal game registry
const INTERNAL_GAMES: Record<string, React.ComponentType<{ onPlay?: () => void }>> = {
  'memory-game': MemoryGame,
}

export function GamePlayer({ url, title, embedAllowed, onPlay }: GamePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Check if this is an internal game
  const isInternalGame = url.startsWith('internal://')
  const internalGameId = isInternalGame ? url.replace('internal://', '') : null
  const InternalGameComponent = internalGameId ? INTERNAL_GAMES[internalGameId] : null

  // Render internal game if available
  if (isInternalGame && InternalGameComponent) {
    return (
      <div
        id="game-player-container"
        className="relative w-full bg-background rounded-lg overflow-hidden border"
      >
        <div className="p-4">
          <InternalGameComponent onPlay={onPlay} />
        </div>
      </div>
    )
  }

  // If internal game not found, show error
  if (isInternalGame && !InternalGameComponent) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center gap-4 p-6">
        <Alert className="max-w-md">
          <AlertDescription>
            이 게임을 찾을 수 없습니다.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleLoad = () => {
    setIsLoading(false)
    onPlay?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.getElementById('game-player-container')?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const openExternal = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
    onPlay?.()
  }

  if (!embedAllowed || hasError) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center gap-4 p-6">
        <Alert className="max-w-md">
          <AlertDescription>
            {hasError
              ? '게임을 불러올 수 없습니다. 새 탭에서 열어주세요.'
              : '이 게임은 외부 사이트에서만 플레이할 수 있습니다.'}
          </AlertDescription>
        </Alert>
        <Button onClick={openExternal} className="gap-2">
          <ExternalLink className="w-4 h-4" />
          새 탭에서 열기
        </Button>
      </div>
    )
  }

  return (
    <div
      id="game-player-container"
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <iframe
        src={url}
        title={title}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white"
          onClick={openExternal}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

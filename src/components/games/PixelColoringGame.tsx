/**
 * Pixel Coloring Game Component
 * A pixel art coloring game where users can color templates or upload their own images
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Download,
  Upload,
  RotateCcw,
  Eraser,
  Paintbrush,
  Grid3X3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

// Pixel art templates (16x16 grids)
// 0 = empty/white, numbers 1-9 = different colors to fill
const TEMPLATES = {
  rabbit: {
    name: 'rabbit',
    emoji: '🐰',
    grid: [
      [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,2,1,1,1,1,1,1,2,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,3,3,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    suggestedColors: { 1: '#FFE4E1', 2: '#000000', 3: '#FFB6C1' }
  },
  apple: {
    name: 'apple',
    emoji: '🍎',
    grid: [
      [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0],
      [0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0],
      [0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0],
      [0,0,2,2,2,3,3,2,2,2,2,2,2,0,0,0],
      [0,0,2,2,3,3,2,2,2,2,2,2,2,0,0,0],
      [0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
      [0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
      [0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0],
      [0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0],
      [0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    suggestedColors: { 1: '#8B4513', 2: '#FF0000', 3: '#FF6B6B' }
  },
  mushroom: {
    name: 'mushroom',
    emoji: '🍄',
    grid: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,2,1,1,1,2,1,1,1,0,0,0],
      [0,0,1,1,2,2,1,1,1,2,2,1,1,1,0,0],
      [0,0,1,1,2,2,1,1,1,2,2,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
      [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
      [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
      [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
      [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    suggestedColors: { 1: '#FF0000', 2: '#FFFFFF', 3: '#F5DEB3' }
  },
  star: {
    name: 'star',
    emoji: '⭐',
    grid: [
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0],
      [0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0],
      [1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    suggestedColors: { 1: '#FFD700' }
  },
  heart: {
    name: 'heart',
    emoji: '❤️',
    grid: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0],
      [0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    suggestedColors: { 1: '#FF1493' }
  },
}

// Color palette
const COLOR_PALETTE = [
  '#FF0000', '#FF6B6B', '#FF8C00', '#FFD700', '#FFFF00',
  '#90EE90', '#00FF00', '#008000', '#00FFFF', '#0000FF',
  '#8A2BE2', '#FF00FF', '#FFB6C1', '#FFA07A', '#F5DEB3',
  '#8B4513', '#000000', '#808080', '#FFFFFF', '#FFE4E1',
]

interface PixelColoringGameProps {
  onPlay?: () => void
}

export function PixelColoringGame({ onPlay }: PixelColoringGameProps) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [isEraser, setIsEraser] = useState(false)
  const [pixelGrid, setPixelGrid] = useState<string[][]>([])
  const [templateGrid, setTemplateGrid] = useState<number[][]>([])
  const [gridSize, setGridSize] = useState(16)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGrid, setShowGrid] = useState(true)

  // Initialize empty grid
  const initializeGrid = useCallback((size: number) => {
    const newGrid = Array(size).fill(null).map(() =>
      Array(size).fill('#FFFFFF')
    )
    setPixelGrid(newGrid)
    setTemplateGrid([])
    setGridSize(size)
  }, [])

  // Load template
  const loadTemplate = useCallback((templateKey: string) => {
    const template = TEMPLATES[templateKey as keyof typeof TEMPLATES]
    if (!template) return

    const size = template.grid.length
    setGridSize(size)
    setTemplateGrid(template.grid)

    // Initialize pixel grid with white
    const newGrid = Array(size).fill(null).map(() =>
      Array(size).fill('#FFFFFF')
    )
    setPixelGrid(newGrid)
    setSelectedTemplate(templateKey)
    onPlay?.()
  }, [onPlay])

  // Initialize with empty 16x16 grid
  useEffect(() => {
    initializeGrid(16)
  }, [initializeGrid])

  // Handle pixel click
  const handlePixelClick = (row: number, col: number) => {
    // Check if this pixel is part of the template (non-zero)
    if (templateGrid.length > 0 && templateGrid[row][col] === 0) {
      return // Can't color outside template area
    }

    const newGrid = [...pixelGrid]
    newGrid[row] = [...newGrid[row]]
    newGrid[row][col] = isEraser ? '#FFFFFF' : selectedColor
    setPixelGrid(newGrid)
  }

  // Handle mouse events for continuous drawing
  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true)
    handlePixelClick(row, col)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      handlePixelClick(row, col)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  // Reset current artwork
  const resetArtwork = () => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate)
    } else {
      initializeGrid(gridSize)
    }
  }

  // Download artwork as PNG
  const downloadArtwork = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pixelSize = 20
    canvas.width = gridSize * pixelSize
    canvas.height = gridSize * pixelSize

    // Draw pixels
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        ctx.fillStyle = pixelGrid[row][col]
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize)
      }
    }

    // Download
    const link = document.createElement('a')
    link.download = `pixel-art-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      // Create canvas for pixelation
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Determine grid size based on image aspect ratio
      const newGridSize = 16
      canvas.width = newGridSize
      canvas.height = newGridSize

      // Draw and pixelate image
      ctx.drawImage(img, 0, 0, newGridSize, newGridSize)

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, newGridSize, newGridSize)
      const newGrid: string[][] = []

      for (let row = 0; row < newGridSize; row++) {
        const rowColors: string[] = []
        for (let col = 0; col < newGridSize; col++) {
          const i = (row * newGridSize + col) * 4
          const r = imageData.data[i]
          const g = imageData.data[i + 1]
          const b = imageData.data[i + 2]
          rowColors.push(`rgb(${r}, ${g}, ${b})`)
        }
        newGrid.push(rowColors)
      }

      setPixelGrid(newGrid)
      setTemplateGrid([])
      setSelectedTemplate(null)
      setGridSize(newGridSize)
      onPlay?.()
    }

    img.src = URL.createObjectURL(file)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const cellSize = Math.min(300 / gridSize, 24)

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Template Selection */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">{t('games.pixelColoring.selectTemplate')}</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TEMPLATES).map(([key, template]) => {
            // Type assertion needed for dynamic translation keys
            const templateNames: Record<string, string> = {
              rabbit: t('games.pixelColoring.templates.rabbit'),
              apple: t('games.pixelColoring.templates.apple'),
              mushroom: t('games.pixelColoring.templates.mushroom'),
              star: t('games.pixelColoring.templates.star'),
              heart: t('games.pixelColoring.templates.heart'),
            }
            return (
              <Button
                key={key}
                variant={selectedTemplate === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => loadTemplate(key)}
                className="gap-1"
              >
                <span>{template.emoji}</span>
                <span className="hidden sm:inline">{templateNames[key]}</span>
              </Button>
            )
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">{t('games.pixelColoring.uploadImage')}</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Color Palette */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">{t('games.pixelColoring.selectColor')}</h3>
        <div className="flex flex-wrap gap-1">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color)
                setIsEraser(false)
              }}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded border-2 transition-transform ${
                selectedColor === color && !isEraser
                  ? 'border-primary scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button
          variant={!isEraser ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsEraser(false)}
          className="gap-1"
        >
          <Paintbrush className="w-4 h-4" />
          {t('games.pixelColoring.brush')}
        </Button>
        <Button
          variant={isEraser ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsEraser(true)}
          className="gap-1"
        >
          <Eraser className="w-4 h-4" />
          {t('games.pixelColoring.eraser')}
        </Button>
        <Button
          variant={showGrid ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className="gap-1"
        >
          <Grid3X3 className="w-4 h-4" />
          {t('games.pixelColoring.grid')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetArtwork}
          className="gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          {t('games.pixelColoring.reset')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadArtwork}
          className="gap-1"
        >
          <Download className="w-4 h-4" />
          {t('games.pixelColoring.download')}
        </Button>
      </div>

      {/* Current Color Preview */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">{t('games.pixelColoring.currentColor')}:</span>
        <div
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: isEraser ? '#FFFFFF' : selectedColor }}
        />
        {isEraser && <span className="text-sm text-muted-foreground">{t('games.pixelColoring.eraser')}</span>}
      </div>

      {/* Pixel Grid */}
      <Card className="mb-4">
        <CardContent className="p-4 flex justify-center">
          <div
            className="inline-block touch-none"
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                gap: showGrid ? '1px' : '0px',
                backgroundColor: showGrid ? '#e5e7eb' : 'transparent',
              }}
            >
              {pixelGrid.map((row, rowIndex) =>
                row.map((color, colIndex) => {
                  const isTemplatePixel = templateGrid.length === 0 || templateGrid[rowIndex][colIndex] !== 0
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handlePixelClick(rowIndex, colIndex)
                      }}
                      className={`
                        transition-colors
                        ${isTemplatePixel ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}
                      `}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: color,
                        opacity: isTemplatePixel ? 1 : 0.3,
                      }}
                      disabled={!isTemplatePixel}
                    />
                  )
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Instructions */}
      {!selectedTemplate && pixelGrid.flat().every(c => c === '#FFFFFF') && (
        <div className="text-center text-sm text-muted-foreground">
          <p>{t('games.pixelColoring.instructions')}</p>
        </div>
      )}
    </div>
  )
}

/**
 * CategoryFilter Component
 * Filter bar for selecting game categories
 */

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { CategoriesResponse } from '@/schemas'

interface CategoryFilterProps {
  categories: CategoriesResponse['categories']
  selectedCategory: string | null
  onSelect: (category: string | null) => void
  isLoading?: boolean
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  isLoading = false,
}: CategoryFilterProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-20 flex-shrink-0" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        variant={selectedCategory === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect(null)}
        className="flex-shrink-0"
      >
        전체
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(category.id)}
          className="flex-shrink-0"
        >
          {category.name}
          <span className="ml-1 text-xs opacity-70">({category.count})</span>
        </Button>
      ))}
    </div>
  )
}

interface SortFilterProps {
  sortOption: 'popular' | 'latest' | 'rating'
  onSelect: (option: 'popular' | 'latest' | 'rating') => void
}

export function SortFilter({ sortOption, onSelect }: SortFilterProps) {
  const options = [
    { value: 'popular' as const, label: '인기순' },
    { value: 'latest' as const, label: '최신순' },
    { value: 'rating' as const, label: '평점순' },
  ]

  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            sortOption === option.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

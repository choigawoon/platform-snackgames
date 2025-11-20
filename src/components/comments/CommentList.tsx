/**
 * CommentList Component
 * List of comments with loading and empty states
 */

import { MessageCircle } from 'lucide-react'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import type { CommentResponse } from '@/schemas'

interface CommentListProps {
  comments: CommentResponse[]
  total: number
  isLoading?: boolean
  onSubmit: (data: { nickname: string; content: string }) => void
  onDelete?: (id: number) => void
  isSubmitting?: boolean
}

export function CommentList({
  comments,
  total,
  isLoading = false,
  onSubmit,
  onDelete,
  isSubmitting = false,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 py-4">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="font-semibold">댓글 {total}</h3>
      </div>

      <CommentForm onSubmit={onSubmit} isLoading={isSubmitting} />

      <Separator />

      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>아직 댓글이 없습니다.</p>
          <p className="text-sm">첫 번째 댓글을 남겨보세요!</p>
        </div>
      ) : (
        <div className="divide-y">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={onDelete}
              canDelete={!!onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

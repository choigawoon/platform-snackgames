/**
 * CommentForm Component
 * Form for creating new comments
 */

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface CommentFormProps {
  onSubmit: (data: { nickname: string; content: string }) => void
  isLoading?: boolean
}

export function CommentForm({ onSubmit, isLoading = false }: CommentFormProps) {
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('snackgames-nickname') || ''
  })
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname.trim() || !content.trim()) return

    // Save nickname for future use
    localStorage.setItem('snackgames-nickname', nickname.trim())

    onSubmit({
      nickname: nickname.trim(),
      content: content.trim(),
    })

    setContent('')
  }

  const isValid = nickname.trim().length > 0 && content.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={50}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">댓글</Label>
        <Textarea
          id="content"
          placeholder="댓글을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          disabled={isLoading}
          className="min-h-[100px]"
        />
        <div className="text-xs text-muted-foreground text-right">
          {content.length}/500
        </div>
      </div>
      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full sm:w-auto gap-2"
      >
        <Send className="w-4 h-4" />
        {isLoading ? '등록 중...' : '댓글 등록'}
      </Button>
    </form>
  )
}

'use client'

import { Button } from '@/components/core/button'
import { loadTopicCards } from '@/components/topics/topic-actions'
import { TopicCard } from '@/components/topics/topic-card'
import type { TopicCardData } from '@/lib/discourse/card-data'
import { useState, useTransition } from 'react'

export function SnippetsList({
  categoryId,
  initialCards,
  total,
  pageSize,
  showAuthor,
}: {
  categoryId: number
  initialCards: TopicCardData[]
  total: number
  pageSize: number
  showAuthor?: boolean
}) {
  const [cards, setCards] = useState(initialCards)
  const [failed, setFailed] = useState(false)
  const [isPending, startTransition] = useTransition()

  const remaining = total - cards.length

  function loadMore() {
    setFailed(false)
    startTransition(async () => {
      try {
        const next = await loadTopicCards(categoryId, cards.length, pageSize)
        // Guard against a double-click racing in the same batch twice.
        setCards((current) => {
          const seen = new Set(current.map((card) => card.id))
          return [...current, ...next.cards.filter((c) => !seen.has(c.id))]
        })
      } catch {
        setFailed(true)
      }
    })
  }

  return (
    <>
      <ul className="mt-3 flex flex-col gap-3">
        {cards.map((card) => (
          <li key={card.id}>
            <TopicCard card={card} showAuthor={showAuthor} />
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <Button variant="outline" onClick={loadMore} disabled={isPending}>
            {isPending
              ? 'Loading…'
              : `Load ${Math.min(remaining, pageSize)} more`}
          </Button>
          {failed && (
            <p className="text-muted text-sm">
              Couldn&apos;t load more posts. Please try again.
            </p>
          )}
        </div>
      )}
    </>
  )
}

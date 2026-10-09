import { SnippetsList } from '@/components/topics/snippets-list'
import { loadTopicCards } from '@/components/topics/topic-actions'
import { TOPICS_PAGE_SIZE } from '@/lib/discourse/card-data'

/**
 * Server-rendered listing: the first page of cards is rendered on the server,
 * and further pages are fetched on demand by SnippetsList through the
 * loadTopicCards server action. Only the visible slice has its article read,
 * so the initial response never carries every topic's summary markup.
 */
export async function Snippets(params: {
  categoryId: string
  redirectRoute: string
  showAuthor?: boolean
  pageSize?: number
}) {
  const categoryId = Number(params.categoryId)
  const pageSize = params.pageSize ?? TOPICS_PAGE_SIZE
  const { cards, total } = await loadTopicCards(categoryId, 0, pageSize)

  // Conditional rendering based on the existence of posts
  return total === 0 ? (
    <p className="text-muted mt-3">
      No posts available at the moment. Please try again later.
    </p>
  ) : (
    <SnippetsList
      categoryId={categoryId}
      initialCards={cards}
      total={total}
      pageSize={pageSize}
      showAuthor={params.showAuthor}
    />
  )
}

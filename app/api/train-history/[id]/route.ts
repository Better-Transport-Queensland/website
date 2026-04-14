import { getHistory } from '@/helpers/trainHistoryStore'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const history = getHistory(decodeURIComponent(id))
  return Response.json(history, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

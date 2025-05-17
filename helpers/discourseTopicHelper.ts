import NodeCache from 'node-cache'
import { parseStringPromise } from 'xml2js'

export const cache = new NodeCache({ stdTTL: 1800, checkperiod: 120 }) // 1800 seconds = 30 minutes

export type RSSItem = {
  creator: string
  title: string
  link: string
  pubDate: string
  content: string
  contentSnippet: string
  guid: string
  isoDate: string
}

export type PaginationLinks = {
  self: string
}

export type RSSFeed = {
  title: string
  link: string
  language: string
  lastBuildDate: string
  category: string
  paginationLinks: PaginationLinks
  self: string
  items: RSSItem[] // Array of individual RSS feed items
}

const fetchRSSFeedRawXML = async (url: string): Promise<RSSFeed | null> => {
  try {
    const response = await fetch(url)
    const rawXML = await response.text()

    const parsedData = await parseStringPromise(rawXML, {
      explicitArray: false,
    })
    const { channel } = parsedData.rss ?? {} // Extract channel

    if (!channel) {
      console.warn('Invalid RSS feed structure')
      return null
    }
    return {
      title: channel.title,
      link: channel.link,
      language: channel.language,
      lastBuildDate: channel.lastBuildDate,
      category: channel.category || null, // Auto-map category
      paginationLinks: { self: channel.link },
      self: channel.link,
      items: Array.isArray(channel.item) // Ensure it's an array
        ? channel.item.map(
            (item: any) =>
              ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.description,
                guid: item.guid,
                isoDate: item.pubDate,
                creator: item['dc:creator'],
              }) as RSSItem,
          )
        : [
            // Wrap single item in an array
            {
              title: channel.item.title,
              link: channel.item.link,
              pubDate: channel.item.pubDate,
              content: channel.item.description,
              guid: channel.item.guid,
              isoDate: channel.item.pubDate,
              creator: channel.item['dc:creator'],
            } as RSSItem,
          ],
    }
  } catch (error) {
    console.error('Error parsing RSS XML:', error)
    return null
  }
}

/**
 * Fetches a discoures RSS feed.
 * @param cacheKey - the id for the cache
 * @param url - the RSS feed url
 * @returns fetched RSS feed if it exists, else
 */
export const fetchFromRSSWithCache = async <T>(
  url: string,
  cacheKey: string,
): Promise<RSSFeed | null> => {
  if (cache.has(cacheKey)) {
    console.log('Cache hit') // Debug: Cache was used
    return cache.get(cacheKey) ?? null
  } else {
    console.log('Cache miss') // Debug: Cache wasn't used

    try {
      const response = await fetchRSSFeedRawXML(url)
      cache.set(cacheKey, response) // Cache the feed for 15 minutes
      return response
    } catch (error) {
      console.warn('Failed to fetch RSS feed:', error) // Log the error for debugging
      return null // Gracefully return null in case of an error
    }
  }
}

/**
 * Fetches the RSSFeed for the given category.
 * @param categoryId - the category id.
 */
export const fetchPostsFromCategory = async (
  categoryId: string,
): Promise<RSSFeed | null> => {
  const url = `https://forum.bettertransportqueensland.org/c/${categoryId}.rss`
  const cacheKey = `category-${categoryId}`

  return await fetchFromRSSWithCache(url, cacheKey)
}

export const fetchPostFromCategory = async (
  topicId: string,
  categoryName: string,
): Promise<RSSItem | null> => {
  const url = `https://forum.bettertransportqueensland.org/t/t/${topicId}.rss`
  const cacheKey = `topic-${topicId}`

  var RSSFeed = await fetchFromRSSWithCache<RSSItem>(url, cacheKey)
  var RSSItem = RSSFeed?.items?.at(0) ?? null

  if (
    RSSItem === null ||
    RSSFeed?.category?.toLowerCase() !== categoryName.toLowerCase()
  ) {
    return null // doesn't match the category name, so we will ignore
  }

  return RSSItem
}

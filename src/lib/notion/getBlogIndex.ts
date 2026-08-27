import { Sema } from 'async-sema'
import rpc, { values } from './rpc'
import getTableData from './getTableData'
import { getPostPreview } from './getPostPreview'
import { readFile, writeFile } from '../fs-helpers'
import { BLOG_INDEX_ID, BLOG_INDEX_CACHE } from './server-constants'

export default async function getBlogIndex(previews = true) {
  let postsTable: any = null
  const useCache = process.env.USE_CACHE === 'true'
  const cacheFile = `${BLOG_INDEX_CACHE}${previews ? '_previews' : ''}`

  if (useCache) {
    try {
      postsTable = JSON.parse(await readFile(cacheFile, 'utf8'))
    } catch (err) {
      console.warn(
        'Failed to load blog index cache, will generate new one:',
        err
      )
    }
  }

  if (!postsTable) {
    try {
      const data = await rpc('loadPageChunk', {
        pageId: BLOG_INDEX_ID,
        limit: 100,
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false,
      })

      // Parse table with posts
      const tableBlock = values(data.recordMap.block).find(
        (block: any) => block.value.type === 'collection_view'
      )

      postsTable = await getTableData(tableBlock, true)
    } catch (err) {
      console.warn(
        `Failed to load Notion posts, have you run the create-table script?`,
        err
      )
      throw new Error('Failed to load Notion posts: ' + (err as Error).message)
    }

    // sort all posts by date (most recent first) before picking who gets a
    // preview, so we always fetch the 10 most recent posts' previews
    const postsKeys = Object.keys(postsTable)
      .sort((a, b) => {
        const timeA = postsTable[a].Date
        const timeB = postsTable[b].Date
        return Math.sign(timeB - timeA)
      })
      .splice(0, 10)

    const sema = new Sema(3, { capacity: postsKeys.length })

    if (previews) {
      await Promise.all(
        postsKeys.map(async (postKey) => {
          await sema.acquire()
          const post = postsTable[postKey]
          post.preview = post.id
            ? await getPostPreview(postsTable[postKey].id)
            : []
          sema.release()
        })
      )
    }

    if (useCache) {
      writeFile(cacheFile, JSON.stringify(postsTable), 'utf8').catch(() => {})
    }
  }

  return postsTable
}

import { NextApiRequest, NextApiResponse } from 'next'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import { isPreviewAuthorized } from '../../lib/preview-auth'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!isPreviewAuthorized(req, res)) return

  const postsTable = await getBlogIndex()

  if (!postsTable) {
    return res.status(401).json({ message: 'Failed to fetch posts' })
  }

  res.setPreviewData({})
  res.writeHead(307, { Location: `/blog` })
  res.end()
}

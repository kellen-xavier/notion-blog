import { NextApiRequest, NextApiResponse } from 'next'
import getPageData from '../../lib/notion/getPageData'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import { isValidPreviewToken } from '../../lib/notion/utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!isValidPreviewToken(req.query.token)) {
    return res.status(401).json({ message: 'invalid token' })
  }

  const postsTable = await getBlogIndex()

  if (!postsTable) {
    return res.status(401).json({ message: 'Failed to fetch posts' })
  }

  res.setPreviewData({})
  res.writeHead(307, { Location: `/blog` })
  res.end()
}

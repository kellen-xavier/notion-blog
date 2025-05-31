import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { src } = req.query

  if (!src || typeof src !== 'string') {
    return res.status(400).send('Missing image URL')
  }

  try {
    const notionToken = process.env.NOTION_TOKEN
    const imageRes = await fetch(src, {
      headers: {
        Cookie: `token_v2=${notionToken}`,
      },
    })

    if (!imageRes.ok) {
      console.warn(`Failed to fetch image: ${src}, status: ${imageRes.status}`)
      return res.status(imageRes.status).send('Error fetching image')
    }

    res.setHeader(
      'Content-Type',
      imageRes.headers.get('content-type') ?? 'image/jpeg'
    )
    imageRes.body.pipe(res)
  } catch (err) {
    console.error('Error in image proxy:', err)
    res.status(500).send('Internal server error')
  }
}

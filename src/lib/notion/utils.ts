import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

export function setHeaders(req: NextApiRequest, res: NextApiResponse): boolean {
  // set SPR/CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'pragma')

  if (req.method === 'OPTIONS') {
    res.status(200)
    res.end()
    return true
  }
  return false
}

export async function handleData(res: NextApiResponse, data: any) {
  data = data || { status: 'error', message: 'unhandled request' }
  res.status(data.status !== 'error' ? 200 : 500)
  res.json(data)
}

export function handleError(res: NextApiResponse, error: string | Error) {
  console.error(error)
  res.status(500).json({
    status: 'error',
    message: 'an error occurred processing request',
  })
}

// Compares the preview token against PREVIEW_TOKEN (a secret dedicated to
// unlocking preview mode) rather than NOTION_TOKEN, so a leaked preview
// link can never expose the Notion session cookie. Uses a constant-time
// comparison to avoid leaking the token via response-time differences.
export function isValidPreviewToken(token: unknown): boolean {
  const expected = process.env.PREVIEW_TOKEN

  if (typeof token !== 'string' || !expected) return false

  const tokenBuf = Buffer.from(token)
  const expectedBuf = Buffer.from(expected)

  if (tokenBuf.length !== expectedBuf.length) {
    // still perform a comparison so the early return above is the only
    // length-dependent timing signal, not this branch
    crypto.timingSafeEqual(expectedBuf, expectedBuf)
    return false
  }

  return crypto.timingSafeEqual(tokenBuf, expectedBuf)
}

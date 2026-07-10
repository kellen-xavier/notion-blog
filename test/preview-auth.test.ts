import test from 'node:test'
import assert from 'node:assert/strict'

import { isPreviewAuthorized } from '../src/lib/preview-auth'

// Cria um par req/res falso o suficiente para o helper.
function makeReqRes(token: unknown) {
  const req: any = { query: { token } }
  const res: any = {
    statusCode: 0,
    body: undefined,
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(payload: unknown) {
      this.body = payload
      return this
    },
  }
  return { req, res }
}

function withEnv(vars: Record<string, string | undefined>, fn: () => void) {
  const previous: Record<string, string | undefined> = {}
  for (const key of Object.keys(vars)) {
    previous[key] = process.env[key]
    if (vars[key] === undefined) delete process.env[key]
    else process.env[key] = vars[key]
  }
  try {
    fn()
  } finally {
    for (const key of Object.keys(previous)) {
      if (previous[key] === undefined) delete process.env[key]
      else process.env[key] = previous[key]
    }
  }
}

test('autoriza quando o token bate com PREVIEW_TOKEN dedicado', () => {
  withEnv(
    { PREVIEW_TOKEN: 'segredo-preview', NOTION_TOKEN: 'token-notion' },
    () => {
      const { req, res } = makeReqRes('segredo-preview')
      assert.equal(isPreviewAuthorized(req, res), true)
      assert.equal(res.statusCode, 0)
    }
  )
})

test('nega (404) quando o token não bate com PREVIEW_TOKEN', () => {
  withEnv(
    { PREVIEW_TOKEN: 'segredo-preview', NOTION_TOKEN: 'token-notion' },
    () => {
      // não deve aceitar o NOTION_TOKEN quando PREVIEW_TOKEN existe
      const { req, res } = makeReqRes('token-notion')
      assert.equal(isPreviewAuthorized(req, res), false)
      assert.equal(res.statusCode, 404)
    }
  )
})

test('nega (401) quando o token não é string', () => {
  withEnv(
    { PREVIEW_TOKEN: 'segredo-preview', NOTION_TOKEN: 'token-notion' },
    () => {
      const { req, res } = makeReqRes(undefined)
      assert.equal(isPreviewAuthorized(req, res), false)
      assert.equal(res.statusCode, 401)
    }
  )
})

test('fallback: usa NOTION_TOKEN quando PREVIEW_TOKEN não está definido', () => {
  withEnv({ PREVIEW_TOKEN: undefined, NOTION_TOKEN: 'token-notion' }, () => {
    const { req, res } = makeReqRes('token-notion')
    assert.equal(isPreviewAuthorized(req, res), true)
  })
})

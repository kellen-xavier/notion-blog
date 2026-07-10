import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getBlogLink,
  getDateStr,
  postIsPublished,
  normalizeSlug,
} from '../src/lib/blog-helpers'

test('getBlogLink monta o caminho do post', () => {
  assert.equal(getBlogLink('meu-post'), '/blog/meu-post')
})

test('postIsPublished só considera "Yes" como publicado', () => {
  assert.equal(postIsPublished({ Published: 'Yes' }), true)
  assert.equal(postIsPublished({ Published: 'No' }), false)
  assert.equal(postIsPublished({}), false)
})

test('normalizeSlug remove barras no início e no fim (recursivo)', () => {
  assert.equal(normalizeSlug('/meu-post/'), 'meu-post')
  assert.equal(normalizeSlug('//meu-post//'), 'meu-post')
  assert.equal(normalizeSlug('meu-post'), 'meu-post')
})

test('normalizeSlug retorna a entrada quando não for string', () => {
  assert.equal(normalizeSlug(undefined as any), undefined)
})

test('getDateStr formata uma data legível', () => {
  const out = getDateStr('2020-01-15')
  assert.match(out, /January/)
  assert.match(out, /2020/)
})

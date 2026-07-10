import test from 'node:test'
import assert from 'node:assert/strict'

import { render } from '../src/components/equation'

test('render devolve markup do KaTeX para expressão válida', () => {
  const out = render('x^2 + y^2', true)
  assert.equal(typeof out, 'string')
  assert.ok(out.includes('katex'))
})

test('render nunca retorna undefined para expressão inválida', () => {
  // KaTeX lança ParseError para LaTeX inválido; o helper deve devolver string.
  const out = render('\\frac{', true)
  assert.equal(typeof out, 'string')
})

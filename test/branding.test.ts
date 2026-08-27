import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Arquivos user-facing que não devem conter resíduos do template original.
const userFacingFiles = [
  'src/components/header.tsx',
  'src/components/footer.tsx',
]

// Padrões do template original que não devem reaparecer nesses arquivos.
const forbidden = [/ijjk/i, /now\.sh/i]

for (const file of userFacingFiles) {
  test(`sem resíduos do template em ${file}`, () => {
    const content = readFileSync(resolve(process.cwd(), file), 'utf8')
    for (const pattern of forbidden) {
      assert.ok(
        !pattern.test(content),
        `Encontrado resíduo do template (${pattern}) em ${file}`
      )
    }
  })
}

test('links de código-fonte apontam para o repositório do Kellen', () => {
  const header = readFileSync(
    resolve(process.cwd(), 'src/components/header.tsx'),
    'utf8'
  )
  assert.ok(header.includes('github.com/kellen-xavier/notion-blog'))
})

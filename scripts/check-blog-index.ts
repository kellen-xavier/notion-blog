// Diagnóstico: confirma se NOTION_TOKEN/BLOG_INDEX_ID conseguem enxergar a
// tabela de posts. Roda fora do Next, lendo .env.local. Não imprime o token.
// Usa getBlogIndex() de verdade (o mesmo caminho do app em produção), então
// o resultado aqui reflete exatamente o que o build vai ver.
//
// Uso:
//   TS_NODE_TRANSPILE_ONLY=true TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' \
//     node --require ts-node/register scripts/check-blog-index.ts
import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import { NOTION_TOKEN, BLOG_INDEX_ID } from '../src/lib/notion/server-constants'
import getBlogIndex from '../src/lib/notion/getBlogIndex'

async function main() {
  if (!NOTION_TOKEN) {
    console.log('❌ NOTION_TOKEN não está definido em .env.local')
    return
  }
  if (!BLOG_INDEX_ID) {
    console.log('❌ BLOG_INDEX_ID não está definido em .env.local')
    return
  }

  console.log(`ℹ️  BLOG_INDEX_ID: ${BLOG_INDEX_ID}`)
  console.log(
    `ℹ️  NOTION_TOKEN: ${NOTION_TOKEN.slice(0, 6)}...${NOTION_TOKEN.slice(
      -4
    )} (${NOTION_TOKEN.length} caracteres)`
  )
  if (NOTION_TOKEN.startsWith('ntn_') || NOTION_TOKEN.startsWith('secret_')) {
    console.log(
      '⚠️  Esse é o formato de uma chave de INTEGRAÇÃO da API pública ' +
        '(ntn_/secret_). Este projeto usa a API privada, autenticada pelo ' +
        'cookie de sessão "token_v2" do navegador — pode não funcionar para ' +
        'páginas que não sejam públicas.'
    )
  }

  try {
    const table = await getBlogIndex(false)
    const posts = Object.values(table) as any[]
    const published = posts.filter((p) => p.Published === 'Yes')

    console.log(
      `✅ getBlogIndex() funcionou: ${posts.length} posts encontrados (${published.length} publicados).`
    )
    for (const p of posts.slice(0, 5)) {
      console.log(`   - [${p.Published === 'Yes' ? 'Yes' : '—'}] ${p.Page}`)
    }
    if (posts.length > 5) console.log(`   ... e mais ${posts.length - 5}`)
  } catch (err) {
    console.log(`❌ getBlogIndex() falhou: ${(err as Error).message}`)
    console.log(
      '   Causas prováveis: NOTION_TOKEN inválido/expirado (precisa ser o ' +
        'cookie "token_v2", não uma chave de integração), ou BLOG_INDEX_ID ' +
        'aponta para uma página sem a tabela criada pelo create-table.js.'
    )
  }
}

main()

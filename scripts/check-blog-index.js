// Diagnóstico: confirma se NOTION_TOKEN/BLOG_INDEX_ID conseguem enxergar a
// tabela de posts. Roda fora do Next, lendo .env.local. Não imprime o token.
//
// Uso: node scripts/check-blog-index.js
const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd())

const {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
  API_ENDPOINT,
} = require('../src/lib/notion/server-constants')
const fetch = require('node-fetch')

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
  console.log(
    NOTION_TOKEN.startsWith('ntn_') || NOTION_TOKEN.startsWith('secret_')
      ? '❌ Esse é o formato de uma chave de INTEGRAÇÃO da API pública (ntn_/secret_). Este projeto precisa do cookie de sessão "token_v2" do navegador, não dessa chave.'
      : 'ℹ️  Formato do token não é ntn_/secret_ (bom sinal, mas não garante que seja um token_v2 válido).'
  )

  const res = await fetch(`${API_ENDPOINT}/loadPageChunk`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `token_v2=${NOTION_TOKEN}`,
    },
    body: JSON.stringify({
      pageId: BLOG_INDEX_ID,
      limit: 100,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false,
    }),
  })

  console.log(`ℹ️  HTTP status da API do Notion: ${res.status}`)

  if (!res.ok) {
    console.log(
      '❌ A API do Notion recusou a requisição (token inválido/expirado ou sem acesso à página).'
    )
    return
  }

  const data = await res.json()
  const blocks = Object.values(data.recordMap?.block || {})
  const types = blocks.map((b) => b.value?.type)
  const hasTable = types.includes('collection_view')

  console.log(`ℹ️  Blocos retornados: ${blocks.length}`)
  console.log(
    `ℹ️  Tipos encontrados: ${[...new Set(types)].join(', ') || '(nenhum)'}`
  )

  if (hasTable) {
    console.log(
      '✅ Achou um bloco "collection_view" — a tabela existe e é visível com esse token.'
    )
  } else {
    console.log(
      '❌ Nenhum bloco "collection_view" encontrado. Ou o token não está autenticado de verdade ' +
        '(sessão inválida/expirada), ou essa página não tem a tabela criada pelo create-table.js, ' +
        'ou BLOG_INDEX_ID aponta para a página errada.'
    )
  }
}

main().catch((err) => {
  console.error('❌ Erro ao consultar a API do Notion:', err.message)
})

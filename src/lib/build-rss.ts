// src/lib/build-rss.ts

import { resolve } from 'path'
import { writeFile } from './fs-helpers'
import { renderToStaticMarkup } from 'react-dom/server'

import { textBlock } from './notion/renderers'
import getBlogIndex from './notion/getBlogIndex'
import getNotionUsers from './notion/getNotionUsers'
import { postIsPublished, getBlogLink } from './blog-helpers'
import { loadEnvConfig } from '@next/env'
import serverConstants from './notion/server-constants'

// Evita substituição de NODE_ENV na Vercel
process.env['NODE' + '_ENV'] = 'production'
process.env.USE_CACHE = 'true'

const NOW = new Date().toJSON()

function mapToAuthor(author: any) {
  return `<author><name>${author.full_name}</name></author>`
}

function decode(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function mapToEntry(post: any) {
  return `
    <entry>
      <id>${post.link}</id>
      <title>${decode(post.title)}</title>
      <link href="${post.link}"/>
      <updated>${new Date(post.date).toJSON()}</updated>
      <content type="xhtml">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${renderToStaticMarkup(
            post.preview
              ? (post.preview || []).map((block: any, idx: number) =>
                  textBlock(block, false, post.title + idx)
                )
              : post.content
          )}
          <p class="more">
            <a href="${post.link}">Read more</a>
          </p>
        </div>
      </content>
      ${(post.authors || []).map(mapToAuthor).join('\n      ')}
    </entry>`
}

function createRSS(blogPosts: any[] = []) {
  const postsString = blogPosts.map(mapToEntry).join('')
  return `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>My Blog</title>
    <subtitle>Blog</subtitle>
    <link href="/atom" rel="self" type="application/rss+xml"/>
    <link href="/" />
    <updated>${NOW}</updated>
    <id>My Notion Blog</id>${postsString}
  </feed>`
}

async function main() {
  loadEnvConfig(process.cwd())

  const token = process.env.NOTION_TOKEN
  const blogIndex = process.env.BLOG_INDEX_ID

  if (!token || !blogIndex) {
    throw new Error(`❌ NOTION_TOKEN ou BLOG_INDEX_ID não estão definidos.`)
  }

  serverConstants.NOTION_TOKEN = token
  serverConstants.BLOG_INDEX_ID = serverConstants.normalizeId(blogIndex)

  const postsTable = await getBlogIndex(true)

  if (!postsTable || Object.keys(postsTable).length === 0) {
    throw new Error(
      `❌ Nenhum post carregado. Verifique o ID do blog ou a API.`
    )
  }

  const neededAuthors = new Set<string>()
  const blogPosts = Object.keys(postsTable)
    .map((slug) => {
      const post = postsTable[slug]
      if (!postIsPublished(post)) return null
      post.authors = post.Authors ?? []
      post.authors.forEach((a: string) => neededAuthors.add(a))
      return post
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...neededAuthors])

  blogPosts.forEach((post) => {
    post.authors = post.authors.map((id: string) => users[id])
    post.link = getBlogLink(post.Slug)
    post.title = post.Page
    post.date = post.Date
  })

  const outputPath = './public/atom'
  await writeFile(resolve(outputPath), createRSS(blogPosts))
  console.log(`✅ Atom feed gerado com sucesso: \`${outputPath}\``)
}

main().catch((err) => {
  console.error('❌ Erro ao gerar RSS:', err)
  process.exit(1)
})

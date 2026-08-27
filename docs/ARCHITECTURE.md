# Arquitetura

Blog estático em **Next.js (Pages Router)** que usa o **Notion como CMS**. O
conteúdo vive em uma tabela do Notion e o site é gerado via SSG com revalidação
incremental (ISR). Deploy na Vercel.

## Stack

| Camada    | Tecnologia                                                        |
| --------- | ----------------------------------------------------------------- |
| Framework | Next.js `^11.1.2`                                                 |
| UI        | React 17, CSS Modules                                             |
| Linguagem | TypeScript (`strict: false`)                                      |
| Conteúdo  | API privada não-oficial do Notion (`www.notion.so/api/v3`)        |
| Extras    | `katex` (equações), `prismjs` (código), `async-sema` (rate limit) |

## Estrutura de pastas

```
src/
├── pages/
│   ├── index.tsx          # Home
│   ├── contact.tsx        # Contato
│   ├── blog/index.tsx     # Lista de posts (getStaticProps)
│   ├── blog/[slug].tsx    # Post individual (getStaticProps/Paths + fallback)
│   └── api/               # asset, preview, preview-post, clear-preview
├── lib/
│   ├── notion/            # Integração com o Notion (rpc, getBlogIndex, ...)
│   ├── preview-auth.ts    # Autorização do modo de preview
│   ├── blog-helpers.ts    # Helpers puros (slug, datas, publicação)
│   └── build-rss.ts       # Geração do feed Atom no build
├── components/            # Header, Footer, Code, Equation, Counter, SVGs, ...
└── styles/                # CSS Modules + global.css
scripts/create-table.js    # Cria a tabela-modelo no Notion
test/                      # Testes unitários (node:test)
```

## Fluxo de dados

1. **`rpc.ts`** faz `POST` autenticado no endpoint privado do Notion usando o
   cookie `token_v2=$NOTION_TOKEN`.
2. **`getBlogIndex`** carrega a tabela (`BLOG_INDEX_ID`), monta o mapa de posts via
   `getTableData` (interpreta o schema da collection) e busca _previews_ dos 10
   posts mais recentes com concorrência limitada a 3 (`async-sema`). Usa cache em
   disco (`.blog_index_data*`) durante o build (`USE_CACHE`).
3. **`blog/index.tsx`** filtra rascunhos em produção (`Published === 'Yes'`) e lista.
4. **`blog/[slug].tsx`** busca o conteúdo (`getPageData` → `loadPageChunk` paginado),
   resolve embeds de tweets e converte cada tipo de bloco do Notion em JSX.
5. **`api/asset.ts`** atua como proxy: obtém a URL assinada do arquivo no Notion
   (`getSignedFileUrls`) e redireciona (307).
6. **`build-rss.ts`** roda no build e gera o feed Atom em `public/atom`.
7. **Preview mode**: `api/preview.ts` e `preview-post.ts` habilitam o modo rascunho,
   protegidos por `src/lib/preview-auth.ts`.

## Pontos de atenção (dívida técnica conhecida)

- Depende da **API privada do Notion**, que pode quebrar sem aviso. Migração para a
  API oficial (`@notionhq/client`) é o caminho recomendado a médio prazo.
- Embeds de tweet dependem da disponibilidade do oembed público do X/Twitter.
- `tsconfig` com `strict: false` — muitos `any` no código de integração.
- Sem CI configurado (rodar `yarn typecheck` + `yarn test` manualmente ou via Action).

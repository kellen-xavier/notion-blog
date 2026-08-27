# Contexto persistente do projeto

Informações estáveis sobre o repositório `kellen-xavier/notion-blog`, para
reidratar o contexto de agentes entre sessões. Ver também o `AGENTS.md` na raiz.

## Identidade

- **Dono**: Kellen Xavier (GitHub: `kellen-xavier`).
- **Origem**: fork do template `ijjk/notion-blog`.
- **Deploy**: Vercel — https://notion-blog-lake-two.vercel.app/
- **Branch padrão**: `develop`.

## Stack resumida

- Next.js `^11.1.2` (Pages Router), React 17, TypeScript (`strict: false`).
- Notion como CMS via API **privada** (`www.notion.so/api/v3`, cookie `token_v2`).
- KaTeX (equações), PrismJS (código), async-sema (rate limit), github-slugger.

## Variáveis de ambiente (apenas nomes — nunca valores)

- `NOTION_TOKEN` — secreto (sessão do Notion).
- `BLOG_INDEX_ID` — id da tabela/índice do blog.
- `PREVIEW_TOKEN` — segredo dedicado do modo de preview (obrigatório; sem
  fallback para `NOTION_TOKEN`).
- `NODE_OPTIONS=--openssl-legacy-provider` — necessário no build local em Node 17+.

## Peculiaridades que costumam pegar

- Build local em Node 17+ falha com `digital envelope routines::unsupported` sem a
  flag `--openssl-legacy-provider` (na Vercel isso vem do `vercel.json`).
- `NOTION_TOKEN` precisa ser o cookie de sessão `token_v2`, não uma chave de
  integração da API pública (`ntn_...`/`secret_...`) — essa falha de forma
  enganosa (sem erro de autenticação, só sem achar a tabela de posts).
- `next build` só coleta dados com `NOTION_TOKEN`/`BLOG_INDEX_ID` válidos; sem
  credenciais reais, a compilação passa mas a coleta de páginas falha (esperado).
- Cache de build em disco: `.blog_index_data` e `.blog_index_data_previews`
  (ignorados pelo git).

## Estado da análise (2026-07)

Correções aplicadas: dependências declaradas, token de preview dedicado,
branding do template removido, bugs pequenos (equation/revalidate/tweet oembed),
scripts de `typecheck`/`test`, `docs/` e este setup de agentes. Detalhes em
`docs/CHANGELOG-analise.md`.

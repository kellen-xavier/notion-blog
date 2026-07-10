# Notas de segurança

## Token de preview (corrigido)

**Antes:** as rotas `pages/api/preview.ts` e `pages/api/preview-post.ts`
autorizavam o modo de preview comparando `?token=` diretamente com o
`NOTION_TOKEN`. Como esse token vai na query string, ele acabava exposto em logs
de servidor, histórico de navegador e no cabeçalho `Referer` — vazando a
credencial de acesso ao Notion.

**Agora:** a autorização foi centralizada em `src/lib/preview-auth.ts`
(`isPreviewAuthorized`) e usa um segredo dedicado, `PREVIEW_TOKEN`.

- Se `PREVIEW_TOKEN` estiver definido, apenas ele é aceito.
- Se **não** estiver definido, há fallback para o comportamento antigo (comparar
  com `NOTION_TOKEN`), com um aviso no log — assim deploys existentes não quebram.

**Ação recomendada:** definir `PREVIEW_TOKEN` nas variáveis de ambiente
(local e Vercel) com um valor forte e aleatório, diferente do `NOTION_TOKEN`.
Depois disso, o fallback deixa de ser usado.

## API privada do Notion

O projeto usa a API interna não-oficial do Notion (`www.notion.so/api/v3`) via
cookie `token_v2`. Implicações:

- O `NOTION_TOKEN` é a sua **sessão pessoal** do Notion — trate como senha.
- A API pode mudar/quebrar sem aviso.
- Migrar para a API oficial (`@notionhq/client` + integração/token oficial) reduz
  o risco e evita usar a credencial pessoal.

## Proxy de assets

`pages/api/asset.ts` assina URLs de arquivos do Notion e responde com
`Access-Control-Allow-Origin: *`. Vale, futuramente, restringir origem e validar
os parâmetros `assetUrl`/`blockId` para evitar uso indevido do proxy.

## Regras gerais

- **Nunca** commitar tokens/segredos. Use `.env.local` (ignorado pelo `.gitignore`).
- Configure segredos apenas nas Environment Variables da Vercel.
- Nenhuma credencial deve aparecer em `README.md`, `docs/` ou código.

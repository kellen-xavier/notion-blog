# Notas de segurança

## Token de preview (corrigido)

**Antes:** as rotas `pages/api/preview.ts` e `pages/api/preview-post.ts`
autorizavam o modo de preview comparando `?token=` diretamente com o
`NOTION_TOKEN`. Como esse token vai na query string, ele acabava exposto em logs
de servidor, histórico de navegador e no cabeçalho `Referer` — vazando a
credencial de acesso ao Notion.

**Agora:** a autorização foi centralizada em `src/lib/preview-auth.ts`
(`isPreviewAuthorized`) e usa um segredo dedicado, `PREVIEW_TOKEN`, comparado
em tempo constante (`crypto.timingSafeEqual`).

- Se `PREVIEW_TOKEN` bater, a requisição é autorizada.
- Se `PREVIEW_TOKEN` **não estiver definido**, o modo preview fica
  **desabilitado** (404) — propositalmente **sem** fallback para
  `NOTION_TOKEN`. Um fallback reabriria exatamente o vazamento que este
  segredo dedicado existe para evitar.

**Ação recomendada:** definir `PREVIEW_TOKEN` nas variáveis de ambiente
(local e Vercel) com um valor forte e aleatório, diferente do `NOTION_TOKEN`,
antes de usar o modo preview.

## API privada do Notion

O projeto usa a API interna não-oficial do Notion (`www.notion.so/api/v3`) via
cookie `token_v2`. Implicações:

- O `NOTION_TOKEN` é a sua **sessão pessoal** do Notion — trate como senha.
- A API pode mudar/quebrar sem aviso.
- Migrar para a API oficial (`@notionhq/client` + integração/token oficial) reduz
  o risco e evita usar a credencial pessoal.

**Pegadinha comum:** `NOTION_TOKEN` precisa ser o valor do cookie de sessão
`token_v2` (DevTools do navegador > Application/Storage > Cookies >
notion.so), **não** uma chave de integração da API pública/oficial (as que
começam com `ntn_` ou `secret_`, geradas em notion.so/my-integrations). Uma
chave de integração não é rejeitada com erro de autenticação — o Notion
simplesmente devolve a página como se não houvesse sessão logada, e o build
falha mais adiante, sem encontrar a tabela de posts.

## Proxy de assets

`pages/api/asset.ts` assina URLs de arquivos do Notion e responde com
`Access-Control-Allow-Origin: *`. Vale, futuramente, restringir origem e validar
os parâmetros `assetUrl`/`blockId` para evitar uso indevido do proxy.

## Regras gerais

- **Nunca** commitar tokens/segredos. Use `.env.local` (ignorado pelo `.gitignore`).
- Configure segredos apenas nas Environment Variables da Vercel.
- Nenhuma credencial deve aparecer em `README.md`, `docs/` ou código.

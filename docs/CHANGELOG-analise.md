# Changelog — Análise e correções

Registro das mudanças feitas durante a análise completa do repositório. Todas as
alterações foram validadas com `yarn typecheck`, `yarn test` e `next build`
(compilação bem-sucedida; a coleta de dados exige credenciais reais do Notion).

## Correções

### Dependências

- Declaradas no `package.json` dependências que antes só resolviam de forma
  transitiva (frágil): `node-fetch@2.6.1`, `@next/env@11.1.2` e (dev)
  `shell-quote@1.7.2`, além de `@types/node-fetch@2.6.1`.

### Segurança

- **Token de preview**: extraída a autorização para `src/lib/preview-auth.ts`,
  passando a usar um segredo dedicado `PREVIEW_TOKEN` (com fallback para
  `NOTION_TOKEN` para não quebrar produção). Detalhes em `SECURITY.md`.

### Branding (resíduos do template original)

- `components/header.tsx`: link "Source Code", OG image, `og:title`, `description`
  e remoção do `twitter:site` do template. OG image aponta para o deploy atual.
- `components/footer.tsx`: link do rodapé passa a apontar para o repositório do Kellen.
- `lib/notion/server-constants.js`: link da mensagem de erro atualizado para a doc do projeto.
- `pages/blog/[slug].tsx`: comentário de exemplo neutralizado.

### Bugs

- `components/equation.tsx`: `render()` agora **sempre** retorna string (antes podia
  retornar `undefined` quando o erro não era `ParseError`). Função exportada e testada.
- `pages/blog/[slug].tsx`: `unstable_revalidate` (ignorado no Next 11) trocado por `revalidate`.
- `pages/blog/[slug].tsx`: embed de tweet migrado do endpoint v1 descontinuado
  (`api.twitter.com/1/statuses/oembed.json`) para o oembed público
  (`publish.twitter.com/oembed`), com guarda extra para `html` vazio.

### Infra/DX

- `package.json`: adicionados `engines.node >=20` e scripts `typecheck` e `test`.
- Criada a pasta `test/` com testes unitários (`node:test` + `ts-node`).
- Criada a pasta `docs/` e o setup de agentes (`AGENTS.md` + `.agents/`).
- `README.md` revisado (Node 20, variáveis, nota de build local, correção de crases).

## Testes

Cobertura unitária adicionada para: `blog-helpers` (slug/data/publicação),
`preview-auth` (4 caminhos de autorização), `equation.render` (nunca `undefined`)
e guarda de branding (sem resíduos do template).

## Não alterado de propósito

- Chaves de schema `ijjk`/`S6_"`/... em `scripts`/`createTable.js`: são
  identificadores opacos do Notion; renomear não traz benefício e arrisca o script.
- Migração para a API oficial do Notion e upgrade do Next.js ficam como trabalho futuro.

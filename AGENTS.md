# AGENTS.md

Guia persistente para agentes de IA (e humanos) que trabalham neste repositório.
Complementa a documentação em [`docs/`](./docs/README.md) e o contexto adicional
em [`.agents/`](./.agents/).

> Convenção: o arquivo padrão reconhecido por ferramentas de agentes é
> `AGENTS.md` (raiz). Informações mais detalhadas/persistentes ficam em `.agents/`.

## O que é o projeto

Blog estático em **Next.js (Pages Router)** que usa o **Notion como CMS**.
Geração via SSG + ISR, deploy na Vercel. Visão completa em
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Setup rápido

```bash
yarn install
yarn dev        # http://localhost:3000
```

Variáveis de ambiente em [`docs/SETUP.md`](./docs/SETUP.md). Nunca commite segredos.

## Comandos que um agente deve rodar antes de concluir uma mudança

```bash
yarn typecheck  # tsc --noEmit
yarn test       # testes unitários (node:test)
```

Para validar o build de produção localmente (Node 17+ exige a flag OpenSSL):

```bash
NODE_OPTIONS=--openssl-legacy-provider yarn build
```

## Regras importantes

- **Segurança/segredos**: `NOTION_TOKEN` e `PREVIEW_TOKEN` são secretos. Nunca
  coloque valores reais em código, `README.md`, `docs/` ou commits. Use `.env.local`.
- **Testar antes de implementar/concluir**: toda correção deve vir acompanhada de
  validação (typecheck + testes; e build quando fizer sentido).
- **Não quebrar produção**: mudanças sensíveis (ex.: autorização de preview) devem
  manter compatibilidade retroativa (ver o fallback em `src/lib/preview-auth.ts`).
- **Branch padrão**: `develop`. Abrir PRs contra `develop`.
- **Estilo**: Prettier (`singleQuote`, sem `;`). Rode `yarn format`.

## Convenções de teste

- Testes em `test/*.test.ts`, usando `node:test` + `node:assert` via `ts-node`.
- Priorize testar funções puras/helpers (ex.: `blog-helpers`, `preview-auth`,
  `equation.render`). Código que fala com a API do Notion não é testado
  unitariamente (depende de credenciais/rede).

## Dívida técnica conhecida

- Depende da API **privada** do Notion — migrar para a API oficial é o objetivo futuro.
- `tsconfig` com `strict: false`.
- Sem CI automatizado (candidato a GitHub Actions rodando typecheck + test).

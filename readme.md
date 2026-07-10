# Meu Notion Blog

## Sobre esse template

Esse projeto foi feito a partir de um fork do [template original](https://github.com/ijjk/notion-blog).
Como mantenho textos e documentações no Notion, uso este blog como backup/publicação
desse conteúdo.

> Projeto em Next.js que demonstra geração de site estático (SSG) usando o Notion
> como backend.

📚 Documentação completa em [`docs/`](./docs/README.md) — setup, arquitetura e segurança.
Diretrizes para agentes/contribuidores em [`AGENTS.md`](./AGENTS.md).

## 📦 Requisitos

- Node.js `>=20` (o projeto usa `Array.prototype.toSorted`)
- Yarn `>=1.22`
- Conta no Notion com acesso à API
- Conta na Vercel (opcional, para deploy)

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env.local` (nunca comitado) com:

```env
NOTION_TOKEN=seu_token_do_notion
BLOG_INDEX_ID=id_da_tabela_do_blog
PREVIEW_TOKEN=um_segredo_forte_para_o_modo_preview
```

> `PREVIEW_TOKEN` é opcional, mas **recomendado**: evita expor o `NOTION_TOKEN`
> nas URLs de preview. Detalhes em [`docs/SECURITY.md`](./docs/SECURITY.md).

## Rodar localmente

```bash
yarn install       # instala dependências
yarn dev           # desenvolvimento em http://localhost:3000
```

## Build de produção

```bash
yarn build         # next build + geração do feed Atom (public/atom)
yarn start         # serve o build (porta 3000)
```

> **Node 17+**: o build local precisa da flag OpenSSL legada
> (na Vercel isso já vem do `vercel.json`):
>
> ```bash
> NODE_OPTIONS=--openssl-legacy-provider yarn build
> ```

## Qualidade

```bash
yarn typecheck     # checagem de tipos (tsc --noEmit)
yarn test          # testes unitários
yarn format        # Prettier
```

## Deploy (Vercel)

Deploy automático configurado na Vercel: [ver deploy](https://notion-blog-lake-two.vercel.app/).

O build de produção usa:

```bash
yarn vercel-build
```

## Feito com 💻 por Kellen Xavier

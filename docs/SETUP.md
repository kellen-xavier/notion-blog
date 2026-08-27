# Setup e execução local

> ⚠️ **Nunca** faça commit de tokens ou segredos. Use `.env.local` (já ignorado
> pelo `.gitignore`). Os valores abaixo são apenas placeholders.

## Requisitos

- Node.js `22.x` (fixado em `package.json` > `engines`).
- Yarn `>=1.22`.
- Uma conta no Notion com acesso à API e uma tabela de blog (ver abaixo).
- Conta na Vercel (opcional, para deploy).

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com:

```env
# Token de sessão do Notion (cookie token_v2). Credencial sensível.
NOTION_TOKEN=coloque_seu_token_aqui

# ID da tabela (page) do Notion que serve de índice do blog.
BLOG_INDEX_ID=coloque_o_id_da_tabela_aqui

# Segredo dedicado para o modo de preview do Next.js.
# Recomendado: NÃO reutilize o NOTION_TOKEN aqui.
# Se não definido, o preview faz fallback para o NOTION_TOKEN (com aviso no log).
PREVIEW_TOKEN=um_segredo_forte_e_aleatorio
```

| Variável        | Obrigatória | Descrição                                                            |
| --------------- | ----------- | -------------------------------------------------------------------- |
| `NOTION_TOKEN`  | Sim         | Cookie `token_v2` da sua sessão do Notion. **Secreto.**              |
| `BLOG_INDEX_ID` | Sim         | ID (32 ou 36 chars) da page/tabela do Notion usada como índice.      |
| `PREVIEW_TOKEN` | Recomendada | Segredo próprio para autorizar o modo de preview. Ver `SECURITY.md`. |

Na Vercel, configure essas variáveis em **Project Settings → Environment
Variables** (não no repositório).

## Instalar e rodar

```bash
yarn install       # instala dependências
yarn dev           # desenvolvimento em http://localhost:3000
```

## Build de produção

```bash
yarn build         # next build + geração do feed Atom em public/atom
yarn start         # serve o build
```

### Nota sobre Node 17+ e OpenSSL (importante para build local)

O Next 11 com webpack 5 usa hashing MD4 legado, que quebra em Node 17+ com o erro
`digital envelope routines::unsupported`. Na Vercel isso já é tratado pelo
`vercel.json` (`NODE_OPTIONS=--openssl-legacy-provider`). **Localmente**, esse
ajuste não é aplicado automaticamente; use:

```bash
NODE_OPTIONS=--openssl-legacy-provider yarn build
```

## Criar a tabela do blog no Notion

O script cria a tabela-modelo (com as colunas Page, Slug, Published, Date, Authors)
dentro da page apontada por `BLOG_INDEX_ID`:

```bash
node scripts/create-table.js
```

## Qualidade

```bash
yarn typecheck     # tsc --noEmit
yarn test          # testes unitários
yarn format        # Prettier
```

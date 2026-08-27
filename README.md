# Meu Notion Blog

## Sobre esse template

Esse template foi feito um fork a partir deste aqui [template original](https://github.com/ijjk/notion-blog).
Estou realizando os ajustes, e como tenho alguns textos e documentações, algumas estão no Notion
então esse template é perfeito!

> Este é um projeto de exemplo em Next.js que demonstra o suporte à geração de site estático (SSG - static-site generation) usando a API privada do Notion como backend.

## Rodar Localmente

## Instale dependências

yarn install

## Compile e gere o RSS

yarn build

## Inicie o servidor (porta 3000)

yarn start

## 📦 Requisitos

- Node.js `>=18.x` (recomendado)
- Yarn `>=1.22`
- Conta no Notion com acesso à API
- Conta na Vercel (conectada ao GitHub)

## ⚙️ Variáveis de ambiente

Copie o arquivo de exemplo e preencha com os valores reais:

```bash
cp .env.example .env.local
```

```env
NOTION_TOKEN=seu_token_do_notion
BLOG_INDEX_ID=id_da_tabela_do_blog
PREVIEW_TOKEN=um_segredo_aleatorio_so_seu
```

> `PREVIEW_TOKEN` é usado apenas para liberar o modo preview (`/api/preview`).
> Use um valor aleatório próprio (ex: `openssl rand -hex 32`) e **diferente** do
> `NOTION_TOKEN` — assim, se o link de preview vazar, sua sessão do Notion
> continua segura.
>
> ⚠️ `.env.local` nunca deve ser commitado (já está no `.gitignore`). Em
> produção (Vercel), configure essas mesmas variáveis em
> **Project Settings → Environment Variables**.

### Deploy esta configurado na Vercel

[Link do deploy](https://notion-blog-lake-two.vercel.app/)

🌐 Deploy automático (Vercel)

´´´
yarn vercel-build

´´´

## Feito com 💻 por Kellen Xavier

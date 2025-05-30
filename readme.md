# Meu Notion Blog

## Sobre esse template

Esse template foi feito um fork a partir deste aqui [template original](https://github.com/ijjk/notion-blog).
Estou realizando os ajustes, e como tenho alguns textos e documentações, algumas estão no Notion
então esse template é perfeito!

> Este é um projeto de exemplo em Next.js que demonstra o suporte à geração de site estático (SSG - static-site generation) usando a API privada do Notion como backend.

## Getting Started

| Comandos para executar - desenvolvimento local

´´´
export NODE_OPTIONS=--openssl-legacy-provider

NODE_OPTIONS=--openssl-legacy-provider yarn dev

yarn build && yarn start

´´´

## Deploy

Deploy esta configurado na Vercel.

[Link do deploy](https://notion-blog-lake-two.vercel.app/)

1. Clone this repo `git clone https://github.com/ijjk/notion-blog.git`
2. Configure project with [`vc`](https://vercel.com/download)
3. Add your `NOTION_TOKEN` and `BLOG_INDEX_ID` as environment variables in [your project](https://vercel.com/docs/integrations?query=envir#project-level-apis/project-based-environment-variables). See [here](#getting-blog-index-and-token) for how to find these values

4. Do final deployment with `vc`

## Credits

- Guillermo Rauch [@rauchg](https://twitter.com/rauchg) for the initial idea
- Shu Ding [@shuding\_](https://twitter.com/shuding_) for the design help
- Luis Alvarez [@luis_fades](https://twitter.com/luis_fades) for design help and bug catching

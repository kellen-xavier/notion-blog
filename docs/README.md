# Documentação — notion-blog

Documentação técnica do projeto. Nada aqui contém segredos, tokens ou dados
sensíveis: variáveis de ambiente são citadas **apenas pelo nome**, com valores
de exemplo/placeholder.

## Índice

- [SETUP.md](./SETUP.md) — como instalar, configurar variáveis de ambiente e rodar localmente.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — visão geral da arquitetura e do fluxo de dados.
- [SECURITY.md](./SECURITY.md) — notas de segurança (token de preview, API privada do Notion).
- [CHANGELOG-analise.md](./CHANGELOG-analise.md) — registro das mudanças feitas na análise/correções.

## Comandos úteis

| Comando          | Descrição                                     |
| ---------------- | --------------------------------------------- |
| `yarn dev`       | Servidor de desenvolvimento (porta 3000).     |
| `yarn build`     | Build de produção + geração do feed Atom.     |
| `yarn start`     | Sobe o build de produção.                     |
| `yarn typecheck` | Checagem de tipos com `tsc --noEmit`.         |
| `yarn test`      | Testes unitários (`node --test` + `ts-node`). |
| `yarn format`    | Formata o código com Prettier.                |

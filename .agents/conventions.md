# Convenções de trabalho

## Git

- Branch padrão: `develop`. PRs são abertos contra `develop`.
- Mensagens de commit: descritivas, em português, com prefixo de tipo
  (`fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- Não commitar segredos nem arquivos de ambiente (`.env*` estão no `.gitignore`).

## Código

- Formatação via Prettier: aspas simples, sem ponto e vírgula, `trailingComma: es5`.
  Rode `yarn format` antes de commitar.
- Prefira funções puras e testáveis em `src/lib`.
- Evite introduzir dependências novas sem necessidade; se importar um pacote,
  **declare-o** no `package.json` (não confie em resolução transitiva).

## Testes

- Local: `test/*.test.ts`.
- Runner: `node --test` + `ts-node` (`yarn test`).
- Toda correção de bug deve vir com um teste que a cubra, quando viável.
- Fluxos que dependem de rede/credenciais (Notion) não são testados unitariamente.

## Checklist antes de concluir

1. `yarn typecheck` sem erros.
2. `yarn test` verde.
3. Quando fizer sentido, `NODE_OPTIONS=--openssl-legacy-provider yarn build` compila.
4. Sem segredos no diff.
5. Documentação atualizada em `docs/` quando o comportamento muda.

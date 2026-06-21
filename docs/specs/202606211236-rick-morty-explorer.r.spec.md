## Regra de negócio – Rick & Morty Explorer

- **Identificador**: rick-morty-explorer
- **Contexto**: App mobile (React Native CLI + TypeScript) que consome a API pública GraphQL do Rick and Morty (`https://rickandmortyapi.com/graphql`).

### 1. Objetivo
Permitir explorar os personagens de Rick & Morty: navegar por uma lista paginada, buscar e filtrar, ver detalhes (incluindo episódios) e favoritar personagens com persistência local. O foco é demonstrar organização de projeto, decisões de arquitetura e qualidade sênior.

### 2. Personas Impactadas
- **Fã/usuário final**: navega, busca, filtra, abre detalhes e favorita personagens.
- **Avaliador técnico**: inspeciona arquitetura, tipagem, testes e aderência aos requisitos do desafio.

### 3. User Stories
- Como usuário, quero ver uma lista paginada de personagens para explorar o catálogo sem carregar tudo de uma vez.
- Como usuário, quero buscar por nome (com debounce) para encontrar um personagem rapidamente.
- Como usuário, quero filtrar por status, espécie e gênero para refinar a lista.
- Como usuário, quero recarregar a lista (pull-to-refresh) e ver estados de loading/erro/vazio claros.
- Como usuário, quero abrir o detalhe de um personagem e ver seus episódios.
- Como usuário, quero favoritar personagens (na lista e no detalhe) e que os favoritos persistam entre sessões.
- Como usuário, quero alternar entre visualização em lista e grade, e que essa escolha seja lembrada.
- Como usuário, quero usar o app em PT-BR ou EN-US, com troca persistida.
- Como usuário, quero alternar tema claro/escuro, com a escolha persistida.

### 4. Regras de Negócio
1. A listagem é paginada por página (`page: Int`); a API informa `info.next` para indicar se há próxima página.
2. A busca por nome dispara a query somente após 500ms de inatividade (debounce).
3. Filtros disponíveis: status (`alive`/`dead`/`unknown`), gênero (`female`/`male`/`genderless`/`unknown`) e espécie (texto livre).
4. Favoritos armazenam a entidade completa do personagem (render offline imediato) e persistem em `AsyncStorage`.
5. A API só retorna dados em inglês; valores enumeráveis (status, gênero, espécies comuns) são traduzidos no cliente, com fallback ao valor original. Nomes próprios (nome, origem, localização, títulos de episódio, tipo) permanecem no original.
6. Erros transitórios de rede (ex.: HTTP 429) devem ser reexecutados automaticamente com backoff antes de exibir a tela de erro.
7. Tema padrão é escuro ("portal"); idioma inicial é detectado do aparelho. Ambas as escolhas manuais são persistidas.

### 5. Critérios de Aceitação
- [x] Lista paginada com infinite scroll e dedupe por página via cache do Apollo.
- [x] Busca por nome com debounce de 500ms.
- [x] Filtros por status, gênero e espécie.
- [x] Estados de loading, erro (com retry) e lista vazia.
- [x] Pull-to-refresh.
- [x] Tela de detalhe com informações + lista de episódios.
- [x] Favoritar na lista e no detalhe, persistido entre sessões.
- [x] i18n PT-BR/EN-US type-safe, com idioma persistido.
- [x] Tema claro/escuro persistido.
- [x] Modo de visualização lista/grade persistido.
- [x] `tsc --noEmit` sem erros; testes unitários (Jest) e e2e (Maestro) passando.

### 6. Riscos e Dependências
- **Risco**: rate-limit (429) da API pública sob uso intenso → **Mitigação**: `RetryLink` com backoff exponencial + jitter.
- **Risco**: GraphQL Codegen não suporta `graphql@17` → **Mitigação**: fixar `graphql@^16` (compatível com Apollo Client 4).
- **Risco**: `<Modal>` do RN invisível a ferramentas de e2e/acessibilidade no iOS → **Mitigação**: filtro como overlay in-tree.
- **Depende de**: API GraphQL pública do Rick and Morty (somente leitura).

## Changelog
- 202606211236 — Criação inicial (retroativa ao estado implementado).

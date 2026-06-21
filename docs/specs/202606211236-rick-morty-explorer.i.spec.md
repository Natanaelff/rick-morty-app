## Plano de Implementação – Rick & Morty Explorer

- **Spec raiz**: `202606211236-rick-morty-explorer.r.spec.md`
- **Branch**: `feature/rick-morty-explorer`

> Spec retroativa: o app já está implementado. O checklist reflete a ordem lógica de construção; itens marcados estão concluídos.

### Ordem de execução
- [x] 1. Setup do projeto RN CLI + TypeScript, dependências e `tsconfig` (`moduleResolution: bundler`).
- [x] 2. Apollo Client (`graphql/client.ts`): `HttpLink` + `RetryLink` + `InMemoryCache` com field policy de paginação.
- [x] 3. Queries tipadas (`graphql/queries.ts` com `TypedDocumentNode`) + GraphQL Codegen (`codegen.yml` → `generated/types.ts`) + mappers.
- [x] 4. Contextos globais: `ThemeContext` (dark padrão + persistência) e `FavoritesContext` (persistência).
- [x] 5. i18n (`i18n/index.ts`) com tipagem estática, persistência de idioma e `translateValue`.
- [x] 6. Átomos e moléculas (Text, Button, Badge, Icon, LoadingSpinner, SearchBar, CharacterCard, EpisodeListItem) + tema/tokens.
- [x] 7. Navegação (Native Stack) + integração Sentry + StatusBar adaptativa.
- [x] 8. `CharacterListScreen`: query, paginação (`fetchMore`/`NetworkStatus`), busca com debounce, filtros (`FilterModal`), favoritos integrados, toggle lista/grade.
- [x] 9. `CharacterDetailScreen`: query por ID, info + lista de episódios, favoritar no header.
- [x] 10. Persistência do modo de visualização (`usePersistedState`).
- [x] 11. Testes unitários (Jest + RNTL) e e2e (Maestro) + `testID`s/`accessibilityLabel`.
- [x] 12. Polimento de UI (overlay de filtro in-tree, selo de favoritos, lista full-bleed) e ícones vetoriais reais.

### Algoritmos e lógica crítica
- **Paginação por cache**: `merge(existing, incoming, { args })` — se `page <= 1`, substitui `results`; senão concatena. `keyArgs: ['filter']` isola listas por combinação de filtro.
- **Tradução de valores**: `translateValue(t, categoria, valor)` → `t('values.<categoria>.<valor.toLowerCase()>', { defaultValue: valor })`.
- **Persistência genérica**: `usePersistedState(key, initial)` — carrega no mount, salva em toda mudança; setter compatível com `useState` (suporta updater funcional).
- **Idioma**: listener `i18n.on('languageChanged')` persiste; no init, carrega o valor salvo e aplica sobre o idioma do aparelho.

### Arquivos a criar
| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `src/graphql/client.ts` | Serviço | Apollo Client + RetryLink + field policy |
| `src/graphql/queries.ts` / `generated/types.ts` / `mappers.ts` | GraphQL | Documentos tipados, tipos gerados e mappers |
| `src/store/{Favorites,Theme}Context.tsx` | Estado | Contextos persistidos |
| `src/i18n/{index.ts,translateValue.ts,locales/*}` | i18n | Config, tradução de valores e dicionários |
| `src/utils/{useDebounce,usePersistedState}.ts` | Hooks | Debounce e persistência genérica |
| `src/components/**` | UI | Atoms/molecules/organisms/templates |
| `src/screens/**` | Telas | Lista e Detalhe |
| `.maestro/*.yaml` | E2E | Fluxos de busca, favoritar e filtro |

### Arquivos a modificar
| Arquivo | Modificação |
|---------|------------|
| `App.tsx` | Providers (Apollo/Theme/Favorites/SafeArea) + Sentry wrap |
| `babel.config.js` | Plugin `@babel/plugin-transform-export-namespace-from` |
| `ios/.../Info.plist`, `android/app/.../assets/fonts` | Fontes do `react-native-vector-icons` |

## Changelog
- 202606211236 — Criação inicial (retroativa ao estado implementado).

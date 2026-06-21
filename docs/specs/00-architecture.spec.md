## Arquitetura — Rick & Morty Explorer

Documento de contexto global. Define os princípios de organização e os fluxos que valem para todas as specs deste projeto.

### Princípios
- **Atomic Design** para a UI: atoms → molecules → organisms → templates → screens.
- **Separação de responsabilidades**: rede/estado de servidor (Apollo) ≠ estado de UI/local (Context + AsyncStorage) ≠ apresentação (styled-components).
- **Tipagem ponta a ponta**: tipos GraphQL gerados (Codegen) + tema tipado (`styled.d.ts`) + chaves i18n type-safe. `tsc` valida acesso a dados e tokens.
- **Sem `any`**: tipos anuláveis do schema são normalizados em mappers para modelos de domínio limpos.

### Estrutura de pastas
```
src/
├── @types/         # Declarações globais (i18n, styled-components)
├── components/     # Atomic Design (atoms, molecules, organisms, templates)
├── graphql/        # client (links + cache), queries tipadas, generated/, mappers
├── i18n/           # config, translateValue, locales (pt/en)
├── navigation/     # Native Stack + tipos de rota
├── screens/        # CharacterList, CharacterDetail
├── store/          # FavoritesContext, ThemeContext
└── utils/          # useDebounce, usePersistedState
```

### Composição de providers (App.tsx)
```
Sentry.ErrorBoundary
└── ApolloProvider (client)
    └── ThemeProvider (styled + tema persistido)
        └── FavoritesProvider
            └── SafeAreaProvider
                └── AppNavigator (NavigationContainer + Native Stack)
```

### Fluxo de dados
1. **Lista**: `useQuery(GET_CHARACTERS, { variables: { page, filter } })`. Paginação acumulada pelo **cache do Apollo** (field policy `merge`/`keyArgs:['filter']`); a tela usa `fetchMore` e `NetworkStatus` (initial/refetch/fetchMore). Busca passa por `useDebounce` (500ms).
2. **Detalhe**: `useQuery(GET_CHARACTER_DETAIL, { variables: { id } })`; episódios renderizados em `FlatList`.
3. **Resiliência**: `RetryLink` reexecuta em erro transitório (429) antes da tela de erro.
4. **Favoritos**: `FavoritesContext` guarda a entidade completa (render offline) e persiste em AsyncStorage. Toggle disponível na lista e no detalhe; filtro "só favoritos" opera localmente.
5. **Preferências**: tema, idioma e modo de visualização são persistidos (AsyncStorage) e reaplicados no launch.

### Decisões de arquitetura notáveis
- **Filtro como overlay in-tree** (não `<Modal>` do RN): no iOS o `<Modal>` renderiza em janela nativa separada, invisível a ferramentas de e2e/acessibilidade.
- **i18n de valores da API** no cliente, pois a API só serve inglês; nomes próprios permanecem no original.
- **Tema dark "portal" como padrão**, com chave de persistência versionada para superar preferências antigas.
- **Favoritos como filtro integrado** na lista (sem rota dedicada), evitando tela redundante.

### Testabilidade
- `testID`s estáveis (independentes de idioma) em toda a UI interativa + `accessibilityLabel` nos cards.
- Camadas de teste: unitários (lógica/hooks/contexto) e e2e (fluxos de usuário via Maestro).

## Changelog
- 202606211236 — Criação inicial.

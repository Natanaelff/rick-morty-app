## Contrato técnico – Rick & Morty Explorer

- **Spec raiz**: `202606211236-rick-morty-explorer.r.spec.md`
- **Identificador técnico**: rick-morty-explorer

### 1. Estrutura de componentes (Frontend — Atomic Design)
- **atoms**: `Text` (variantes title/subtitle/body/caption/label/bold), `Button` (`variant`, `loading`, `title`, `fullWidth`), `Badge` (`status`, `text`), `Icon` (`name`, `size`, `color` — wrapper de `react-native-vector-icons/Ionicons`), `LoadingSpinner` (`fullScreen`, `size`).
- **molecules**: `SearchBar` (`value`, `onChangeText`, `onClear?`), `CharacterCard` (`character`, `isFavorite`, `onFavoriteToggle`, `onPress`, `grid?`), `EpisodeListItem` (`episode`).
- **organisms**: `FilterModal` (`visible`, `currentStatus`, `currentGender`, `currentSpecies`, `onClose`, `onApply`, `onClear`) — overlay in-tree (não usa `<Modal>` do RN).
- **templates**: `ScreenContainer` (`children`, `edges?`).
- **screens**: `CharacterListScreen`, `CharacterDetailScreen`.

### 2. Modelos de dados
```typescript
// Modelo de domínio (store/FavoritesContext + graphql/mappers)
interface Character {
  id: string;
  name: string;
  status: string;   // 'Alive' | 'Dead' | 'unknown' | string
  species: string;
  gender: string;
  image: string;
}

interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;  // ex.: "S01E01"
}
```
> Os tipos das operações são **gerados** por GraphQL Codegen em `src/graphql/generated/types.ts` (campos anuláveis). `graphql/mappers.ts` normaliza esses tipos anuláveis para os modelos de domínio acima.

### 3. Contratos de API (GraphQL — somente leitura)
**Operação**: `GetCharacters($page: Int, $filter: FilterCharacter)`
- Retorna `characters { info { count pages next prev } results { id name status species gender image } }`
- `FilterCharacter`: `{ name?, status?, species?, gender? }`

**Operação**: `GetCharacterDetail($id: ID!)`
- Retorna `character { id name status species type gender image origin { name } location { name } episode { id name air_date episode } }`

**Resiliência**: `RetryLink` (delay inicial 600ms, máx 8s, jitter, até 6 tentativas) reexecuta em erro (incl. 429).

**Paginação**: field policy no `InMemoryCache` para `Query.characters` com `keyArgs: ['filter']` e `merge` (página 1 substitui; demais concatenam). A UI usa `fetchMore` + `NetworkStatus`.

### 4. Roteamento / Navegação
- Native Stack (`RootStackParamList`):
  - `CharacterList` (sem params)
  - `CharacterDetail` (`{ id: string; name: string }`)
- Sentry integrado via `reactNavigationIntegration` registrada no `NavigationContainer`.

### 5. Dependências de serviço
- `graphql/client.ts` — ApolloClient (`from([retryLink, httpLink])` + `InMemoryCache` com type policies).
- `store/FavoritesContext.tsx` — favoritos (Context + AsyncStorage).
- `store/ThemeContext.tsx` — tema (dark padrão, persistido).
- `i18n/index.ts` — i18next (idioma persistido via listener `languageChanged`); `i18n/translateValue.ts` traduz valores da API.
- `utils/useDebounce.ts` — debounce de busca.
- `utils/usePersistedState.ts` — `useState` espelhado em AsyncStorage (usado no modo de visualização).

## Changelog
- 202606211236 — Criação inicial (retroativa ao estado implementado).

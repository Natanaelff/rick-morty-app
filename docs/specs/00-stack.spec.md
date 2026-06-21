## Stack — Rick & Morty Explorer

Documento de contexto global. Define a pilha de tecnologia e as versões/decisões que valem para todas as specs deste projeto.

### Plataforma
- **React Native CLI** (sem Expo) + **TypeScript**
- Alvos: iOS e Android
- Node: `>= 22.11.0`

### Dados & Estado de servidor
- **Apollo Client 4** (`@apollo/client`) consumindo GraphQL
- **`graphql@^16`** — fixado nesta major porque o GraphQL Codegen ainda não suporta `graphql@17` (Apollo 4 é compatível com 16)
- **GraphQL Codegen** (`@graphql-codegen/cli` + `typescript-operations`) → tipos das operações; documentos tipados com `TypedDocumentNode`
- **`RetryLink`** com backoff exponencial + jitter para erros transitórios (ex.: 429)
- Paginação idiomática via field policy (`merge`/`keyArgs`) no `InMemoryCache`

### UI & Navegação
- **React Navigation** (Native Stack)
- **styled-components/native** com `ThemeProvider` (tema dark "portal" padrão; light/dark/system, persistido)
- **react-native-vector-icons** (Ionicons) — fontes via CocoaPods (iOS) e `assets/fonts` (Android)

### Estado local & Persistência
- **Context API**: `FavoritesContext`, `ThemeContext`
- **AsyncStorage**: favoritos, tema, idioma e modo de visualização
- Hook genérico `usePersistedState` (load-on-mount / save-on-change)

### Internacionalização
- **i18next** + **react-i18next**, PT-BR e EN-US, chaves **type-safe** (extensão de módulo em `@types/i18next.d.ts`)
- Tradução de valores da API no cliente (`translateValue`) com fallback ao original; idioma persistido

### Observabilidade
- **@sentry/react-native@^8** integrado ao React Navigation (`reactNavigationIntegration`); DSN simulado para o desafio

### Qualidade & Testes
- **Jest** + **React Native Testing Library** (unitários)
- **Maestro** (e2e) — fluxos em `.maestro/`
- **TypeScript** estrito (`tsc --noEmit` no CI local)
- Babel: `@babel/plugin-transform-export-namespace-from` (linha 7.x) para a lib `graphql`

### Scripts relevantes
| Script | Ação |
|--------|------|
| `npm run ios` / `npm run android` | Builda e roda no simulador/emulador |
| `npm run start` | Metro bundler |
| `npm test` | Testes unitários (Jest) |
| `npm run test:e2e` | E2E (Maestro) |
| `npm run codegen` | Regenera os tipos GraphQL |

## Changelog
- 202606211236 — Criação inicial.

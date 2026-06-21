## Configuração – Rick & Morty Explorer

- **Spec raiz**: `202606211236-rick-morty-explorer.r.spec.md`

> O app não usa variáveis de ambiente nem feature flags. As constantes abaixo estão embutidas no código (valores fixos de infraestrutura e chaves de persistência).

### Variáveis de Ambiente
Nenhuma.

### Feature Flags
Nenhuma.

### Constantes de Infraestrutura
| Constante | Local | Valor | Descrição |
|-----------|-------|-------|-----------|
| GraphQL URI | `src/graphql/client.ts` | `https://rickandmortyapi.com/graphql` | Endpoint da API pública |
| RetryLink | `src/graphql/client.ts` | initial 600ms · max 8000ms · jitter · 6 tentativas | Backoff para erros transitórios (429) |
| Debounce de busca | `src/utils/useDebounce.ts` (uso na lista) | 500ms | Atraso antes de disparar a query de busca |
| Sentry DSN | `App.tsx` | DSN simulado para o desafio | Captura de erros (não aponta para projeto real) |

### Chaves do AsyncStorage
| Chave | Descrição |
|-------|-----------|
| `@rick_morty_explorer:favorites` | Lista de personagens favoritados |
| `@rick_morty_explorer:theme_mode_v2` | Preferência de tema (`light`/`dark`/`system`) |
| `@rick_morty_explorer:language` | Idioma escolhido (`pt`/`en`) |
| `@rick_morty_explorer:view_mode` | Modo de visualização (`list`/`grid`) |

## Changelog
- 202606211236 — Criação inicial (retroativa ao estado implementado).

# Rick & Morty Explorer

App mobile em **React Native (CLI) + TypeScript** para explorar o universo de Rick and Morty. Consome a API pública GraphQL ([rickandmortyapi.com](https://rickandmortyapi.com/graphql)) e permite navegar pelos personagens, buscar e filtrar, ver detalhes com episódios e montar uma lista de favoritos que sobrevive entre sessões.

## Funcionalidades

**Lista de personagens**

- Listagem paginada com _infinite scroll_ (paginação acumulada pelo cache do Apollo).
- Busca por nome com _debounce_ de 500ms.
- Filtros por status, gênero e espécie em um _bottom sheet_.
- Alternância entre visualização em **lista** e **grade** (2 colunas).
- _Pull-to-refresh_ e estados claros de carregando, vazio e erro (com _retry_).

**Detalhe do personagem**

- Ficha completa: espécie, status, gênero, tipo, origem e localização.
- Lista de todos os episódios em que o personagem aparece.

**Favoritos**

- Favoritar pela lista ou pelo detalhe; filtro rápido para ver só os favoritos.
- Persistidos localmente (continuam após fechar o app).

**Personalização**

- Tema claro/escuro (padrão escuro), seguindo ou não o sistema.
- Idioma PT-BR / EN-US.
- Tema, idioma e modo de visualização são lembrados entre sessões.

## Stack

| Camada       | Tecnologia                                                            |
| ------------ | --------------------------------------------------------------------- |
| Base         | React Native CLI, TypeScript                                          |
| Dados        | Apollo Client 4 + `graphql@16`, GraphQL Codegen (`TypedDocumentNode`) |
| Navegação    | React Navigation (Native Stack)                                       |
| UI           | styled-components, react-native-vector-icons (Ionicons)               |
| i18n         | i18next + react-i18next (chaves type-safe)                            |
| Persistência | AsyncStorage                                                          |
| Erros        | Sentry (integrado ao React Navigation)                                |
| Testes       | Jest + React Native Testing Library, Maestro (e2e)                    |

## Rodando localmente

**Pré-requisitos:** Node `>= 22`, Watchman (macOS) e o ambiente do [React Native CLI](https://reactnative.dev/docs/environment-setup) configurado.

```bash
# 1. Dependências
npm install

# 2. Metro (deixe rodando em um terminal)
npm run start
```

Em outro terminal, rode em uma das plataformas:

**iOS** (macOS)

```bash
cd ios && pod install && cd ..   # uma vez / após mudar deps nativas (inclui as fontes dos ícones)
npm run ios
```

**Android**

```bash
npm run android   # as fontes dos ícones são empacotadas no build via assets/fonts
```

> As fontes do `react-native-vector-icons` são empacotadas pelo CocoaPods (iOS) e via `assets/fonts` (Android). Se precisar revincular: `npx react-native-asset`.
> Os tipos GraphQL já vêm versionados em `src/graphql/generated/`; para regerar a partir do schema: `npm run codegen`.
> O ícone do app é gerado de `assets/icon.svg` (iOS + Android); para regerar após editar o SVG: `npm run icons` (requer rebuild para aparecer).

## Testes

```bash
# Unitários (hooks, contexto de favoritos, render inicial)
npm run test

# E2E — fluxos de busca, favoritar e filtro
#   requer o app rodando no simulador e o Maestro CLI instalado
#   (https://maestro.mobile.dev)
npm run test:e2e
```

> Os fluxos Maestro ficam em `.maestro/` e usam o `appId` do iOS por padrão. Para Android, ajuste o `appId` no topo dos arquivos `.maestro/*.yaml` para `com.rickmortyexplorer`.

## Arquitetura & decisões

O código segue **Atomic Design** (`atoms → molecules → organisms → templates → screens`), separando rede/estado de servidor (Apollo), estado local (Context + AsyncStorage) e apresentação (styled-components).

Algumas decisões que valem o destaque:

- **Tipos GraphQL gerados** (Codegen) e documentos `TypedDocumentNode` — `useQuery` retorna dados tipados. Os tipos anuláveis do schema são normalizados em `graphql/mappers.ts`, mantendo o restante do app livre de `any` e de checagens espalhadas.
- **Paginação no cache do Apollo** via _field policy_ (`merge` + `keyArgs`), acionada por `fetchMore` — sem manter uma cópia paralela das páginas em estado local.
- **Resiliência de rede:** um `RetryLink` com _backoff_ reexecuta requisições em falhas transitórias (ex.: rate-limit `429`) antes de cair na tela de erro.
- **Filtro como overlay na própria árvore** em vez do `<Modal>` do RN — no iOS o `Modal` vive em uma janela nativa separada, fora do alcance de ferramentas de e2e e acessibilidade.
- **Localização dos dados:** a API só responde em inglês, então valores de conjunto fixo (status, gênero, espécies comuns) e datas são traduzidos no cliente, com _fallback_ ao valor original; nomes próprios permanecem intactos.
- **Acessibilidade/testabilidade:** `accessibilityLabel` nos cards e `testID`s estáveis em toda a UI interativa.

### Estrutura

```
src/
├── @types/         # Declarações globais (i18n, styled-components)
├── components/     # Atomic Design: atoms, molecules, organisms, templates
├── graphql/        # client (links + cache), queries, generated/, mappers
├── i18n/           # config, translateValue, locales (pt/en)
├── navigation/     # Native Stack + tipos de rota
├── screens/        # CharacterList, CharacterDetail
├── store/          # FavoritesContext, ThemeContext
└── utils/          # useDebounce, usePersistedState
```

## Documentação

As specs ficam em [`docs/specs/`](docs/specs/), no formato RPI (Research / Planning / Config / Implementing), com dois documentos de contexto (`00-stack`, `00-architecture`) que descrevem a pilha e a arquitetura do projeto.

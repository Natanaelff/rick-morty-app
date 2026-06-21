# Rick & Morty Explorer 🧪📱

Este é um aplicativo **React Native** com **TypeScript** que consome a API pública GraphQL do Rick and Morty. Desenvolvido seguindo as metodologias de **SDD (Spec Driven Development)**, **RPI (Research, Plan, Implement)** e **Atomic Design**.

## 📋 Funcionalidades Implementadas

### Tela 1 — Lista de Personagens
* 🔄 **Listagem Paginada:** Infinite scroll gerenciado e otimizado com FlatList.
* 🔍 **Busca com Debounce:** Caixa de busca que reduz chamadas desnecessárias à API (debounce de 500ms).
* ⚙️ **Filtros Avançados:** Filtros por status (Vivo, Morto, Desconhecido), gênero e espécie através de uma folha/modal de filtros nativa e fluida.
* ⚠️ **Tratamento de Estados:** Telas dedicadas e amigáveis para Loading, Erro (com botão de Retry/Tentar novamente) e lista vazia. Erros transitórios (ex.: HTTP 429) são reexecutados automaticamente pelo `RetryLink` do Apollo.
* 📥 **Pull-to-refresh:** Recarrega a listagem de forma reativa.
* 🔲 **Visualização Lista/Grade:** Botão na barra de busca alterna entre lista (1 coluna) e grade (2 colunas) — preferência persistida no `AsyncStorage`.

### Tela 2 — Detalhe do Personagem
* 👤 **Ficha do Personagem:** Foto grande, espécie, status, gênero, tipo, origem e última localização.
* 🎬 **Lista de Episódios:** Lista otimizada com FlatList (evitando ScrollView aninhado) mostrando todos os episódios em que o personagem aparece.

### ⭐ Favoritar Personagens (Persistência local)
* ❤️ Botão de favoritar tanto no Card da listagem quanto no Cabeçalho de detalhes.
* 💾 Estado global gerenciado via **Context API** e persistido entre sessões com o **AsyncStorage**.
* 🔍 Possibilidade de filtrar a lista principal para exibir apenas os favoritos (com busca funcionando localmente sobre os favoritos).

---

## 🌟 Diferenciais Inclusos

* 🧬 **GraphQL Codegen:** Tipos das operações gerados a partir do schema da API (`npm run codegen`). Os documentos são tipados com `TypedDocumentNode`, então `useQuery` retorna dados totalmente tipados — sem `as any`.
* 📦 **Paginação idiomática do Apollo:** Infinite scroll via *field policy* (`merge`/`keyArgs`) no `InMemoryCache` + `fetchMore`, sem estado de paginação manual paralelo ao cache.
* 🎯 **Ícones vetoriais reais:** `react-native-vector-icons` (Ionicons), com fontes vinculadas no iOS (`UIAppFonts`) e Android (`fonts.gradle`).
* 🌐 **i18next (PT-BR & EN-US):** Tradução completa com detecção automática do idioma do aparelho e chaves estritamente **type-safe** no TypeScript.
* 🎨 **styled-components (Dark/Light Mode):** ThemeProvider com tema escuro "portal" como padrão, suporte automático (sistema) e manual com persistência de escolha.
* 💾 **Preferências persistidas:** tema, idioma e modo de visualização (lista/grade) sobrevivem entre sessões via `AsyncStorage` (hook genérico `usePersistedState`).
* 🛡️ **Resiliência de rede:** `RetryLink` do Apollo com backoff exponencial + jitter recupera de erros transitórios (ex.: rate-limit 429).
* 🐞 **Sentry:** Integração para rastreamento de erros e monitoramento de transações de telas integrada ao **React Navigation**.
* 🧪 **Testes (unitários + e2e):** Jest + RNTL (`useDebounce`, `FavoritesContext`, render inicial) e **Maestro** (fluxos e2e de busca, favoritar e filtro em `.maestro/`).

---

## 🏗️ Estrutura do Projeto (Atomic Design)

```
docs/
  └── specs/                # Specs no protocolo RPI (4 arquivos: .r / .p / .config / .i)
src/
  ├── @types/               # Declarações globais TypeScript (i18n, styled-components)
  ├── assets/               # Imagens e ícones
  ├── components/           # Componentes baseados em Atomic Design
  │   ├── atoms/            # Elementos puros (Text, Button, Badge, LoadingSpinner, IoniconsMock)
  │   ├── molecules/        # Grupos de átomos (SearchBar, CharacterCard, EpisodeListItem)
  │   ├── organisms/        # Organismos funcionais (FilterModal)
  │   └── templates/        # Estruturas de layouts de página (ScreenContainer)
  ├── graphql/              # Apollo Client e Queries GraphQL
  ├── i18n/                 # Dicionários e configurações de idiomas (PT-BR, EN-US)
  ├── navigation/           # Configuração de rotas de telas com React Navigation e Sentry
  ├── screens/              # Telas da aplicação (CharacterList, CharacterDetail)
  ├── store/                # Provedores de estado (FavoritesContext, ThemeContext)
  ├── theme/                # Definições de cores e tamanhos de temas
  └── utils/                # Hooks e funções utilitárias (useDebounce)
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Node.js (versão recomendada: >= 22)
* Watchman (para macOS)
* Ambiente iOS/Android configurado para React Native CLI puro ([Guia de Configuração](https://reactnative.dev/docs/environment-setup))

### Passo a Passo

1. **Clonar e acessar o diretório do projeto:**
   ```bash
   cd rick-morty-explorer
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **(Opcional) Regenerar os tipos GraphQL a partir do schema da API:**
   ```bash
   npm run codegen
   ```
   > Os tipos já vêm versionados em `src/graphql/generated/`; rode apenas se alterar as queries.

4. **Vincular as fontes dos ícones (react-native-vector-icons):**
   ```bash
   npx react-native-asset
   ```
   > No iOS as fontes também são copiadas pelo `pod install`; no Android o `fonts.gradle` já faz o bundling no build.

5. **Instalar dependências nativas do iOS (se estiver no macOS e rodando para iOS):**
   ```bash
   cd ios && pod install && cd ..
   ```

6. **Executar o Metro Bundler (Servidor de Desenvolvimento):**
   ```bash
   npm run start
   ```

7. **Iniciar a aplicação no emulador/dispositivo:**
   * **Android:**
     ```bash
     npm run android
     ```
   * **iOS:**
     ```bash
     npm run ios
     ```

### 🧪 Executando os Testes

**Unitários (Jest + RNTL):**
```bash
npm run test
```

**E2E (Maestro):**

Os fluxos ficam em `.maestro/` (busca, favoritar, filtro). Requer o [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro) instalado e o app rodando no simulador/emulador.

```bash
# 1. Suba o app no simulador (em outra aba)
npm run ios          # ou: npm run android

# 2. Rode os fluxos e2e
npm run test:e2e
```

> Os flows usam o `appId` do iOS por padrão (`org.reactjs.native.example.RickMortyExplorer`). Para Android, troque o `appId` no topo dos arquivos `.maestro/*.yaml` para `com.rickmortyexplorer`.

---

## ✅ Resumo de Verificação

| Verificação | Comando | Status |
|---|---|---|
| Tipagem estática | `npx tsc --noEmit` | 0 erros |
| Testes unitários | `npm run test` | 7/7 (Jest + RNTL) |
| Testes e2e | `npm run test:e2e` | 3/3 flows (Maestro) |
| Instalação | `npm install` | sem `--legacy-peer-deps` |

## 🧭 Decisões Técnicas (resumo)

- **Tipagem GraphQL via Codegen** + `TypedDocumentNode` → zero `as any`; tipos anuláveis normalizados em `graphql/mappers.ts`.
- **Paginação no cache do Apollo** (field policy `merge`/`keyArgs`) + `fetchMore`/`NetworkStatus`, sem estado manual paralelo.
- **`RetryLink`** com backoff → resiliência a 429/erros transitórios.
- **Filtro como overlay in-tree** (não `<Modal>` do RN) → testável no iOS e acessível.
- **i18n** PT/EN type-safe, traduzindo também **valores da API** (status/gênero/espécie) e datas, com fallback ao original.
- **Preferências persistidas** (tema, idioma, visualização lista/grade) via `AsyncStorage` (hook `usePersistedState`).
- **Atomic Design**, tema dark "portal" como identidade, `testID`s + `accessibilityLabel` para testabilidade/acessibilidade.

## 📄 Documentação (specs)

As specs seguem o **protocolo RPI** (4 arquivos por feature) em `docs/specs/`:

```
docs/specs/
  ├── 00-stack.spec.md                              # contexto: pilha de tecnologia
  ├── 00-architecture.spec.md                       # contexto: arquitetura e fluxos
  └── 202606211236-rick-morty-explorer.{r,p,config,i}.spec.md
        .r  → Research    (objetivo, user stories, regras, critérios)
        .p  → Planning    (modelos, contratos GraphQL, componentes)
        .config → Config  (constantes de infra, chaves AsyncStorage)
        .i  → Implementing (checklist, lógica crítica, arquivos)
```

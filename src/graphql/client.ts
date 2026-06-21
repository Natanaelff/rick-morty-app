import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { GetCharactersQuery } from './generated/types';

type CharactersField = GetCharactersQuery['characters'];

// Resiliência a erros transitórios (ex.: 429 "Too Many Requests" da API pública,
// quedas momentâneas de rede): reexecuta a operação com backoff exponencial + jitter.
const retryLink = new RetryLink({
  delay: { initial: 600, max: 8000, jitter: true },
  attempts: { max: 6, retryIf: (error) => !!error },
});

const httpLink = new HttpLink({
  uri: 'https://rickandmortyapi.com/graphql',
});

const client = new ApolloClient({
  link: from([retryLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Offset/page-based pagination handled idiomatically by Apollo.
          // Each unique `filter` keeps its own cached list; pages are merged
          // so `fetchMore` accumulates results without manual local state.
          characters: {
            keyArgs: ['filter'],
            merge(existing: CharactersField, incoming: CharactersField, { args }) {
              const page = (args?.page as number | undefined) ?? 1;
              const existingResults = existing?.results ?? [];
              const incomingResults = incoming?.results ?? [];

              return {
                ...incoming,
                // Page 1 (initial load / pull-to-refresh) replaces the list;
                // subsequent pages append.
                results:
                  page <= 1
                    ? incomingResults
                    : [...existingResults, ...incomingResults],
              };
            },
          },
        },
      },
    },
  }),
});

export default client;

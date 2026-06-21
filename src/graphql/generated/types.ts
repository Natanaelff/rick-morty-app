/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type FilterCharacter = {
  gender?: string | null | undefined;
  name?: string | null | undefined;
  species?: string | null | undefined;
  status?: string | null | undefined;
  type?: string | null | undefined;
};

export type GetCharactersQueryVariables = Exact<{
  page?: number | null | undefined;
  filter?: FilterCharacter | null | undefined;
}>;


export type GetCharactersQuery = { characters: { info: { count: number | null, pages: number | null, next: number | null, prev: number | null } | null, results: Array<{ id: string | null, name: string | null, status: string | null, species: string | null, gender: string | null, image: string | null } | null> | null } | null };

export type GetCharacterDetailQueryVariables = Exact<{
  id: string;
}>;


export type GetCharacterDetailQuery = { character: { id: string | null, name: string | null, status: string | null, species: string | null, type: string | null, gender: string | null, image: string | null, origin: { name: string | null } | null, location: { name: string | null } | null, episode: Array<{ id: string | null, name: string | null, air_date: string | null, episode: string | null } | null> } | null };

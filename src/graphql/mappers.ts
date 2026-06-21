import { Character } from '../store/FavoritesContext';
import { GetCharactersQuery, GetCharacterDetailQuery } from './generated/types';

export interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
}

type CharacterResult = NonNullable<
  NonNullable<GetCharactersQuery['characters']>['results']
>[number];

type CharacterDetail = NonNullable<GetCharacterDetailQuery['character']>;
type EpisodeResult = NonNullable<CharacterDetail['episode']>[number];

/**
 * The Rick & Morty schema marks most fields nullable. These mappers normalize
 * the generated (nullable) query types into the app's clean domain models,
 * keeping `null` handling in one place instead of scattering it across the UI.
 */
export const toCharacter = (raw: CharacterResult | CharacterDetail): Character => ({
  id: raw?.id ?? '',
  name: raw?.name ?? '',
  status: raw?.status ?? 'unknown',
  species: raw?.species ?? '',
  gender: raw?.gender ?? '',
  image: raw?.image ?? '',
});

export const toCharacters = (
  results: NonNullable<GetCharactersQuery['characters']>['results'] | undefined,
): Character[] =>
  (results ?? []).filter((c): c is CharacterResult => c != null).map(toCharacter);

export const toEpisode = (raw: EpisodeResult): Episode => ({
  id: raw?.id ?? '',
  name: raw?.name ?? '',
  air_date: raw?.air_date ?? '',
  episode: raw?.episode ?? '',
});

export const toEpisodes = (
  episodes: CharacterDetail['episode'] | undefined,
): Episode[] =>
  (episodes ?? []).filter((e): e is EpisodeResult => e != null).map(toEpisode);

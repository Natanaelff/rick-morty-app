import { gql, TypedDocumentNode } from '@apollo/client';
import {
  GetCharactersQuery,
  GetCharactersQueryVariables,
  GetCharacterDetailQuery,
  GetCharacterDetailQueryVariables,
} from './generated/types';

export const GET_CHARACTERS: TypedDocumentNode<
  GetCharactersQuery,
  GetCharactersQueryVariables
> = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        image
      }
    }
  }
`;

export const GET_CHARACTER_DETAIL: TypedDocumentNode<
  GetCharacterDetailQuery,
  GetCharacterDetailQueryVariables
> = gql`
  query GetCharacterDetail($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      image
      origin {
        name
      }
      location {
        name
      }
      episode {
        id
        name
        air_date
        episode
      }
    }
  }
`;

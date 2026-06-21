import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesProvider, useFavorites, Character } from '../FavoritesContext';

// Mock AsyncStorage with in-memory mock implementation
let mockStorage: { [key: string]: string } = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async (key: string, value: string) => {
    mockStorage[key] = value;
  }),
  getItem: jest.fn(async (key: string) => {
    return mockStorage[key] || null;
  }),
  removeItem: jest.fn(async (key: string) => {
    delete mockStorage[key];
  }),
  clear: jest.fn(async () => {
    mockStorage = {};
  }),
}));

const mockCharacter: Character = {
  id: '1',
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

describe('FavoritesContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FavoritesProvider>{children}</FavoritesProvider>
  );

  it('should initialize with empty favorites list', async () => {
    const { result } = await renderHook(() => useFavorites(), { wrapper });
    expect(result.current.favorites).toEqual([]);
  });

  it('should add character to favorites', async () => {
    const { result } = await renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      await result.current.addFavorite(mockCharacter);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toEqual(mockCharacter);
    expect(result.current.isFavorite('1')).toBe(true);

    const saved = await AsyncStorage.getItem('@rick_morty_explorer:favorites');
    expect(JSON.parse(saved || '[]')).toEqual([mockCharacter]);
  });

  it('should remove character from favorites', async () => {
    const { result } = await renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      await result.current.addFavorite(mockCharacter);
    });

    expect(result.current.isFavorite('1')).toBe(true);

    await act(async () => {
      await result.current.removeFavorite('1');
    });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite('1')).toBe(false);

    const saved = await AsyncStorage.getItem('@rick_morty_explorer:favorites');
    expect(JSON.parse(saved || '[]')).toEqual([]);
  });

  it('should toggle favorites status', async () => {
    const { result } = await renderHook(() => useFavorites(), { wrapper });

    expect(result.current.isFavorite('1')).toBe(false);

    // Toggle on
    await act(async () => {
      await result.current.toggleFavorite(mockCharacter);
    });
    expect(result.current.isFavorite('1')).toBe(true);

    // Toggle off
    await act(async () => {
      await result.current.toggleFavorite(mockCharacter);
    });
    expect(result.current.isFavorite('1')).toBe(false);
  });
});

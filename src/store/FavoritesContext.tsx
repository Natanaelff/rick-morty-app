import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface FavoritesContextType {
  favorites: Character[];
  addFavorite: (character: Character) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  toggleFavorite: (character: Character) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@rick_morty_explorer:favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Character[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    };
    loadFavorites();
  }, []);

  const addFavorite = async (character: Character) => {
    try {
      const updated = [...favorites, character];
      setFavorites(updated);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to add favorite', e);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const updated = favorites.filter((fav) => fav.id !== id);
      setFavorites(updated);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove favorite', e);
    }
  };

  const toggleFavorite = async (character: Character) => {
    if (isFavorite(character.id)) {
      await removeFavorite(character.id);
    } else {
      await addFavorite(character);
    }
  };

  const isFavorite = (id: string): boolean => {
    return favorites.some((fav) => fav.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};


export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

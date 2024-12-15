import { useEffect, useState } from 'react';

export const FAVORITE_CONTACTS_KEY = 'favorite_contacts';

type UseContactFavoritesReturn = {
  favorites: number[];
  toggleFavorite: (id: number) => void;
};

export const useContactFavorites = (): UseContactFavoritesReturn => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITE_CONTACTS_KEY);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITE_CONTACTS_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id],
    );
  };

  return {
    favorites,
    toggleFavorite,
  };
};

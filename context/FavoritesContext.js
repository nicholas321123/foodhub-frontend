import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('foodhub_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.id === item.id);
      let updated;
      if (isFavorite) {
        updated = prev.filter((fav) => fav.id !== item.id);
      } else {
        updated = [...prev, item];
      }
      localStorage.setItem('foodhub_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);

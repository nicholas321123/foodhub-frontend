import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoriteRestaurants(res.data.restaurants || []);
        setFavoriteProducts(res.data.products || []);
      } catch (e) {
        console.error('Erro ao sincronizar favoritos:', e);
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (item, type = 'restaurant') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const isFav = type === 'restaurant' 
      ? favoriteRestaurants.some(r => r.id === item.id)
      : favoriteProducts.some(p => p.id === item.id);

    try {
      if (isFav) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
          params: type === 'restaurant' ? { restaurantId: item.id } : { productId: item.id }
        });
        if (type === 'restaurant') setFavoriteRestaurants(prev => prev.filter(r => r.id !== item.id));
        else setFavoriteProducts(prev => prev.filter(p => p.id !== item.id));
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/favorites`, 
          type === 'restaurant' ? { restaurantId: item.id } : { productId: item.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (type === 'restaurant') setFavoriteRestaurants(prev => [...prev, item]);
        else setFavoriteProducts(prev => [...prev, item]);
      }
    } catch (e) {
      console.error('Erro ao toggle favorite:', e);
    }
  };

  const isFavorite = (id, type = 'restaurant') => {
    return type === 'restaurant' 
      ? favoriteRestaurants.some(r => r.id === id)
      : favoriteProducts.some(p => p.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteRestaurants, favoriteProducts, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);

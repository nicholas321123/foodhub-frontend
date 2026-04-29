import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Persistência local
  useEffect(() => {
    const savedCart = localStorage.getItem('delivery_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('delivery_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prev) => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (Number(item.preco || item.price || 0) * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartTotal, 
      cartCount,
      clearCart: () => setCartItems([])
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

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
    // Normaliza os dados para garantir que funcionem no carrinho
    const normalizedProduct = {
      id: product.id,
      name: product.nome || product.name,
      price: Number(product.preco || product.price || 0),
      image: product.imagem_url || product.image_url || product.image,
      ...product
    };

    setCartItems((prev) => {
      const existing = prev.find(item => item.id === normalizedProduct.id);
      if (existing) {
        return prev.map(item => 
          item.id === normalizedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...normalizedProduct, quantity: 1 }];
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

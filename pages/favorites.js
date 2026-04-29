import React from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../context/FavoritesContext';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-primary/10 text-primary rounded-[20px]">
            <Heart size={32} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-secondary-light dark:text-secondary-dark">Seus Favoritos</h1>
            <p className="text-gray-500 font-medium">Itens que você salvou para pedir depois.</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-gray-300 dark:text-gray-700" />
            </div>
            <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-2">Nada por aqui ainda...</h2>
            <p className="text-gray-500 mb-8 max-w-xs">Explore nosso catálogo e salve suas comidas favoritas para encontrá-las facilmente aqui.</p>
            <Link href="/">
              <button className="btn-primary">Explorar agora</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

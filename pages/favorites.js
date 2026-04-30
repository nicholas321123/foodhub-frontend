import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import RestaurantCard from '../components/RestaurantCard';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft, Utensils, Package, Sparkles } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesPage() {
  const { favoriteRestaurants, favoriteProducts } = useFavorites();
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === 'products') {
      setActiveTab('products');
    } else if (tab === 'restaurants') {
      setActiveTab('restaurants');
    }
  }, [tab]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    // O FavoritesContext já faz o fetch inicial, então só esperamos um pouco para o efeito visual
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="p-3 bg-white dark:bg-white/5 rounded-2xl text-gray-500 hover:text-primary transition-all shadow-sm border border-gray-100 dark:border-white/10">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-secondary-light dark:text-secondary-dark tracking-tighter flex items-center gap-3">
                Meus <span className="text-primary">Favoritos</span>
              </h1>
              <p className="text-gray-500 font-medium">Tudo o que você mais ama no FoodHub em um só lugar.</p>
            </div>
          </div>

          {/* Tabs Selector */}
          <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit border border-gray-200/50 dark:border-white/5">
            <button 
              onClick={() => setActiveTab('restaurants')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'restaurants' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
            >
              <Utensils size={14} /> Restaurantes
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
            >
              <Package size={14} /> Produtos
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="min-h-[400px]">
          {activeTab === 'restaurants' ? (
            favoriteRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {favoriteRestaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Nenhum restaurante favorito" 
                desc="Seus lugares preferidos aparecerão aqui quando você clicar no coração da página deles." 
                btnText="Explorar Restaurantes"
              />
            )
          ) : (
            favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {favoriteProducts.map(product => (
                  <ProductCard key={product.id} product={product} showRestaurant={true} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Nenhum produto favorito" 
                desc="Aquelas delícias que você amou aparecerão aqui quando você clicar no coração no card do produto." 
                btnText="Explorar Cardápios"
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}

const EmptyState = ({ title, desc, btnText }) => (
  <div className="text-center py-32 bg-white dark:bg-card-dark rounded-[48px] border border-dashed border-gray-200 dark:border-white/10 shadow-premium dark:shadow-none">
    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
      <Heart className="text-gray-200 dark:text-gray-800" size={40} />
    </div>
    <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-2 tracking-tighter">{title}</h2>
    <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">{desc}</p>
    <Link href="/">
      <button className="btn-primary px-10 group flex items-center gap-2 mx-auto">
        <Sparkles size={18} /> {btnText}
      </button>
    </Link>
  </div>
);

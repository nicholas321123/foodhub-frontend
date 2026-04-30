import React from 'react';
import Link from 'next/link';
import { Star, Clock, Heart, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

const RestaurantCard = ({ restaurant }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(restaurant.id, 'restaurant');

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Faça login para favoritar seus restaurantes!');
      return;
    }

    toggleFavorite(restaurant, 'restaurant');
  };

  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="group bg-white dark:bg-[#111111] rounded-[42px] p-5 flex items-center gap-6 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all duration-700 cursor-pointer border border-gray-100 dark:border-white/[0.04] relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-1000" />
        
        {/* Logo/Image Container */}
        <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 relative shadow-inner bg-gray-50 dark:bg-white/5 p-1.5 border border-gray-50 dark:border-white/5">
          <img 
            src={restaurant.logo_url || restaurant.image_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=90&w=600'} 
            className="w-full h-full object-cover rounded-[20px] transition-transform duration-1000 group-hover:scale-110" 
            alt={restaurant.nome} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=90&w=600';
            }}
          />
          
          {/* Heart Badge */}
          <button 
            onClick={handleToggle}
            className={`absolute top-1 right-1 p-2.5 rounded-2xl backdrop-blur-xl transition-all z-10 shadow-lg border border-white/10 ${favorited ? 'bg-primary text-white scale-110' : 'bg-white/90 dark:bg-black/50 text-gray-400 hover:text-primary'}`}
          >
            <Heart size={16} fill={favorited ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-black text-secondary-light dark:text-secondary-dark text-2xl tracking-tighter truncate group-hover:text-primary transition-colors duration-500">
              {restaurant.nome}
            </h3>
            <div className="flex items-center gap-1.5 text-accent font-black bg-accent/10 px-3 py-1.5 rounded-2xl border border-accent/5">
              <Star size={14} fill="currentColor" />
              <span className="text-xs">{restaurant.rating || '4.8'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${restaurant.status?.toLowerCase() === 'fechado' ? 'bg-red-500/5 border-red-500/10 text-red-500' : 'bg-green-500/5 border-green-500/10 text-green-500'}`}>
              {restaurant.status || 'Aberto'}
            </span>
            
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-xs">
              <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg">
                <Clock size={16} className="text-primary" />
              </div>
              <span className="tracking-tighter">{restaurant.tempo_estimado_entrega || '30-45'} MIN</span>
            </div>
          </div>
          
          {/* Soft Indicator Line */}
          <div className="mt-5 h-[2px] w-full bg-gray-50 dark:bg-white/[0.03] rounded-full overflow-hidden">
            <div className="h-full w-0 group-hover:w-1/3 bg-primary/40 transition-all duration-700 ease-out" />
          </div>
        </div>

        {/* Action Button (Subtle) */}
        <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 text-gray-300 group-hover:bg-primary group-hover:text-white transition-all duration-500 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-sm mr-2">
           <ArrowRight size={20} />
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;

import React from 'react';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-white dark:bg-card-dark rounded-[32px] p-4 flex flex-col md:flex-row items-center gap-6 shadow-premium dark:shadow-premium-dark hover:scale-[1.02] transition-all cursor-pointer border border-gray-100 dark:border-white/5">
        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
          <img 
            src={restaurant.logo_url || restaurant.image_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300'} 
            className="w-full h-full object-cover" 
            alt={restaurant.nome} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300';
            }}
          />
        </div>
        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex items-center justify-center md:justify-between mb-2">
            <h3 className="font-black text-secondary-light dark:text-secondary-dark text-xl">{restaurant.nome}</h3>
            <div className="hidden md:flex items-center gap-1 text-accent font-black bg-accent/10 px-2 py-1 rounded-lg">
              <Star size={14} fill="currentColor" />
              <span className="text-xs">4.8</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-bold text-gray-400">
            <span className="bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md uppercase tracking-widest">{restaurant.status || 'Aberto'}</span>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-primary" />
              <span>{restaurant.tempo_estimado_entrega || '30-45'} min</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;

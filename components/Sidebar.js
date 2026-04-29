import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Home, Grid, Utensils, Heart, Info, Phone, Star } from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ isOpen, onClose }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchRestaurants = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/restaurantes`);
          setRestaurants(response.data);
        } catch (error) {
          console.error('Erro ao buscar restaurantes:', error);
        }
      };
      fetchRestaurants();
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-background-dark z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <span className="text-2xl font-black text-primary tracking-tighter">
              Food<span className="text-secondary-light dark:text-secondary-dark">Hub</span>
            </span>
            <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-primary/10 hover:text-primary transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-4">Menu Principal</h3>
            <nav className="space-y-2 mb-10">
              <SidebarLink href="/" icon={<Home size={20} />} label="Página Inicial" onClick={onClose} />
              <SidebarLink href="/categoria" icon={<Grid size={20} />} label="Categorias" onClick={onClose} />
              <SidebarLink href="/favorites" icon={<Heart size={20} />} label="Favoritos" onClick={onClose} />
            </nav>

            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-4">Restaurantes</h3>
            <div className="space-y-4">
              {restaurants.map((res) => (
                <Link href={`/restaurant/${res.id}`} key={res.id}>
                  <div onClick={onClose} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/5 group transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                      <img 
                        src={res.logo_url || res.image_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                        alt={res.nome} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-secondary-light dark:text-secondary-dark text-sm truncate group-hover:text-primary transition-colors">{res.nome}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                          {res.status || 'ABERTO'}
                        </span>
                        <div className="flex items-center gap-0.5 text-accent">
                          <Star size={10} fill="currentColor" />
                          <span className="text-[10px] font-black">{res.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/5 shrink-0">
            <SidebarLink href="/about" icon={<Info size={20} />} label="Sobre o FoodHub" onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarLink = ({ href, icon, label, onClick }) => (
  <Link href={href}>
    <div onClick={onClick} className="flex items-center gap-4 p-4 rounded-2xl text-gray-500 dark:text-gray-400 font-bold hover:bg-primary/5 hover:text-primary transition-all cursor-pointer group">
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  </Link>
);

export default Sidebar;

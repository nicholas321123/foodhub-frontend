import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import RestaurantCard from '../components/RestaurantCard';
import { ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verifica admin (apenas ID 1)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id === 1 && user.tipo === 'admin') {
      setIsAdmin(true);
    }

    const fetchData = async () => {
      try {
        const [resProducts, resRestaurants] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/restaurantes`)
        ]);
        setProducts(resProducts.data);
        setRestaurants(resRestaurants.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-500">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Banner Hero */}
        <section className="mb-14 rounded-[48px] overflow-hidden relative h-[400px] group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1500" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="Promoção"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-16">

            <h1 className="text-white text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">O sabor que você ama,<br/>agora <span className="text-primary italic">mais rápido.</span></h1>
            <p className="text-white/60 mb-8 max-w-md font-medium text-lg">Explore os melhores restaurantes e pratos da cidade em um só lugar.</p>
            
            {isAdmin && (
              <Link href="/admin">
                <button className="flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold backdrop-blur-md w-fit transition-all opacity-80 hover:opacity-100">
                  <ShieldAlert size={16} />
                  Painel de Controle
                </button>
              </Link>
            )}

          </div>
        </section>

        {/* Listagem de Restaurantes */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-title text-3xl md:text-4xl">Restaurantes Populares</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </section>




      </main>

      <footer className="bg-white dark:bg-card-dark border-t border-gray-100 dark:border-white/5 py-20 transition-colors">
        <div className="container mx-auto px-4 text-center">
          <span className="text-3xl font-black text-primary tracking-tighter mb-6 block">
            Food<span className="text-secondary-light dark:text-secondary-dark">Hub</span>
          </span>
          <p className="text-gray-500 font-medium max-w-md mx-auto mb-10 text-lg">A plataforma completa para conectar você aos melhores sabores da sua cidade.</p>
          <div className="flex justify-center gap-12 text-gray-400 font-bold text-sm">
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Trabalhe conosco</a>
            <a href="#" className="hover:text-primary transition-colors">Ajuda</a>
          </div>
          <p className="mt-12 text-gray-300 dark:text-gray-700 text-xs font-bold uppercase tracking-widest">© 2024 FoodHub Delivery. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
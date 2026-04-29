import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';
import { Star, Clock, MapPin, CreditCard, Info, ArrowLeft, Heart, Share2, Sparkles } from 'lucide-react';
import Link from 'next/link';

const RestaurantPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/restaurantes/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Erro ao buscar restaurante:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen">
        <Header />
        <div className="flex justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen">
        <Header />
        <div className="text-center py-40">
          <h1 className="text-4xl font-black text-secondary-light dark:text-secondary-dark">Restaurante não encontrado</h1>
          <Link href="/">
            <button className="btn-primary mt-8 px-10">Voltar para Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      
      <main className="pb-20">
        {/* Banner Section */}
        <div className="relative h-[400px] w-full overflow-hidden">
          <img 
            src={restaurant.banner_url || 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1500'} 
            className="w-full h-full object-cover"
            alt={restaurant.nome}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1500';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-end gap-8">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-white/10 shadow-2xl shrink-0">
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
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {restaurant.status || 'Aberto'}
                    </span>
                    <div className="flex items-center gap-1 text-accent font-black">
                      <Star size={16} fill="currentColor" />
                      <span>{restaurant.rating}</span>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">{restaurant.nome}</h1>
                  <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-primary" />
                      <span>{restaurant.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-primary" />
                      <span>{restaurant.tempo_estimado_entrega ? `${restaurant.tempo_estimado_entrega} min` : '30-45 min'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mb-2">
                  <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-primary transition-all">
                    <Heart size={20} />
                  </button>
                  <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-primary transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info & Menu Section */}
        <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Info */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-card-dark p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-black text-secondary-light dark:text-secondary-dark mb-6 tracking-tighter">Informações</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Horário</p>
                    <p className="text-sm font-bold text-secondary-light dark:text-secondary-dark">18:00 - 23:30</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pagamento</p>
                    <p className="text-sm font-bold text-secondary-light dark:text-secondary-dark">Pix, Cartão de Crédito e Débito</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Info size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Taxa de Entrega</p>
                    <p className="text-sm font-bold text-green-500">
                      Grátis
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary p-8 rounded-[32px] shadow-xl shadow-primary/20 text-white relative overflow-hidden">
              <Sparkles className="absolute -right-10 -bottom-10 opacity-20" size={150} />
              <h4 className="text-xl font-black mb-2 tracking-tighter">Fidelidade FoodHub</h4>
              <p className="text-white/80 text-xs font-medium mb-6">Peça 5 vezes neste restaurante e ganhe um cupom de R$ 15.</p>
              <button className="w-full py-3 bg-white text-primary text-xs font-black rounded-xl hover:bg-gray-100 transition-colors uppercase tracking-widest">Ver meu progresso</button>
            </div>
          </aside>

          {/* Menu Items */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-title text-4xl">Cardápio</h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {restaurant.products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {restaurant.products.length === 0 && (
              <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[48px] border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-gray-400 font-bold">Nenhum item disponível no momento.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default RestaurantPage;

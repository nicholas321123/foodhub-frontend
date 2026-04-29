import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
            <p className="text-white/60 mb-8 max-w-md font-medium text-lg">Explore os melhores pratos da cidade em um só lugar. Dos clássicos aos gourmet, entregamos tudo.</p>

          </div>
        </section>

        {/* Listagem de Produtos (NOVO FOCO DA HOME) */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-title text-4xl">Destaques pra você</h2>

          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {products.map(product => (
                <ProductCard key={`${product.restaurante_id}-${product.id}`} product={product} showRestaurant={true} />
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="mb-20 bg-primary/10 rounded-[48px] p-12 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <Sparkles className="absolute -right-10 -bottom-10 text-primary/5" size={300} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-secondary-light dark:text-secondary-dark mb-2 tracking-tighter">Quer vender no FoodHub?</h2>
            <p className="text-gray-500 font-medium">Cadastre seu restaurante e alcance milhares de novos clientes todos os dias.</p>
          </div>
          <button className="btn-primary px-10 whitespace-nowrap relative z-10">Seja um Parceiro</button>
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
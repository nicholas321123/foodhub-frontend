import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../../components/Header';
import { Star, Clock, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';

const CategoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapeamento de imagens para banners de categoria
  const categoryBanners = {
    'Hambúrguer': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1500',
    'Japonês': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1500',
    'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1500',
    'Açaí': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=1500',
    'Italiano': 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&q=80&w=1500',
    'Saudável': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1500',
    'Frutos do Mar': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=1500',
    'Contemporâneo': 'https://images.unsplash.com/photo-1550966841-3ee71448fa47?auto=format&fit=crop&q=80&w=1500',
    'Gelateria': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=1500',
    'Chocolates': 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=1500',
    'Doces': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=1500',
    'Confeitaria': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=1500',
  };

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Buscar categorias para encontrar a atual
        const catsRes = await axios.get(`${apiBase}/categories`);
        const currentCat = catsRes.data.find(c => String(c.id) === String(id));
        if (currentCat) {
          setCategory(currentCat);
        }

        // Buscar produtos da categoria
        const prodResponse = await axios.get(`${apiBase}/products?categoria_id=${id}`);
        setProducts(prodResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const categoryName = category ? category.name : 'Categoria';
  const defaultBanner = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1500';
  const bannerImage = categoryBanners[categoryName] || defaultBanner;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Banner Hero Dinâmico */}
        <section className="mb-14 rounded-[48px] overflow-hidden relative h-[300px] group shadow-2xl">
          <img 
            src={bannerImage} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt={categoryName}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-16">
            <Link href="/">
              <button className="flex items-center gap-2 text-white/70 hover:text-white font-bold transition-all mb-4 w-fit">
                <ArrowLeft size={20} /> Voltar
              </button>
            </Link>
            <h1 className="text-white text-5xl md:text-7xl font-black mb-2 leading-tight tracking-tighter">
              {categoryName} {category?.icon}
            </h1>
            <p className="text-white/60 font-medium text-lg">
              Os melhores pratos de {categoryName?.toLowerCase() || 'esta categoria'} selecionados para você.
            </p>
          </div>
        </section>

        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {products.map((prod) => (
                <ProductCard key={`${prod.restaurante_id}-${prod.id}`} product={prod} showRestaurant={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-card-dark rounded-[48px] border border-dashed border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-black text-gray-400">Nenhum produto encontrado nesta categoria.</h2>
              <p className="text-gray-500 mt-2">Que tal explorar outras opções?</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;

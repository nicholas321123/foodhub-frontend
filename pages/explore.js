import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Search, Utensils, Star, Clock, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';

export default function ExplorePage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const resCats = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/categories`);
      setCategories(resCats.data);
      if (resCats.data.length > 0) {
        setActiveCategory(resCats.data[0].id);
        fetchProducts(resCats.data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categoryId) => {
    setLoading(true);
    try {
      const resProducts = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products?categoria_id=${categoryId}`);
      setProducts(resProducts.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    fetchProducts(id);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300 pb-20">
      <Header />
      
      {/* Category Tabs Section */}
      <div className="sticky top-[72px] z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-primary text-white shadow-premium shadow-primary/20 scale-105' 
                  : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-primary border border-gray-100 dark:border-white/5'
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-secondary-light dark:text-secondary-dark tracking-tighter flex items-center gap-3">
              <Utensils className="text-primary" /> Explorar
            </h1>
            <p className="text-gray-500 font-medium">Descubra o melhor de cada categoria</p>
          </div>
          
          <div className="bg-white dark:bg-white/5 p-2 rounded-[24px] shadow-sm flex items-center gap-4 border border-gray-100 dark:border-white/5 w-full md:w-96">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="O que você deseja buscar?"
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary-light dark:text-secondary-dark w-full placeholder:text-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Carregando delícias...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="group bg-white dark:bg-card-dark rounded-[40px] overflow-hidden shadow-premium dark:shadow-premium-dark hover:scale-[1.02] transition-all border border-gray-100 dark:border-white/5">
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={product.imagem_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={product.nome}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                        {product.categoria_nome || 'Popular'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-secondary-light dark:text-secondary-dark text-xl mb-1">{product.nome}</h3>
                        <Link href={`/restaurant/${product.restaurante_id}`}>
                          <p className="text-xs font-bold text-primary hover:underline cursor-pointer uppercase tracking-tighter">
                            {product.restaurante_nome}
                          </p>
                        </Link>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-secondary-light dark:text-secondary-dark tracking-tighter">
                          R$ {Number(product.preco).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-xs font-medium mb-8 line-clamp-2 leading-relaxed">
                      {product.descricao || 'Uma deliciosa opção preparada com ingredientes selecionados para você.'}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50 dark:border-white/5">
                      <button 
                        onClick={() => {
                          addToCart(product);
                          router.push('/cart');
                        }}
                        className="flex-1 btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-sm"
                      >
                        <ShoppingBag size={18} /> Comprar Agora
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white dark:bg-white/5 rounded-[48px] border border-dashed border-gray-200 dark:border-white/10">
                <Utensils className="mx-auto text-gray-200 mb-6" size={80} />
                <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-2">Nenhum produto encontrado</h2>
                <p className="text-gray-500">Tente selecionar outra categoria no topo.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { SearchX } from 'lucide-react';
import Link from 'next/link';

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    
    const fetchResults = async () => {
      try {
        setLoading(true);
        if (!q) {
          setProducts([]);
          return;
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/products/search?q=${encodeURIComponent(q)}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [q, router.isReady]);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-secondary-light dark:text-secondary-dark mb-8">
          {q ? `Resultados para "${q}"` : 'Busca de produtos'}
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(product => (
                  <ProductCard key={`${product.restaurante_id}-${product.id}`} product={product} showRestaurant={true} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-full mb-6">
                  <SearchX size={48} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-2">Produto não encontrado</h2>
                <p className="text-gray-500 mb-8 max-w-md">Não encontramos nenhum resultado para "{q}". Tente buscar usando termos diferentes ou navegue pelas categorias.</p>
                <Link href="/">
                  <button className="btn-primary px-8">Voltar para a Home</button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage;

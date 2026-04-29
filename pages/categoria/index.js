import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const CategoriesIndexPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-secondary-light dark:text-secondary-dark tracking-tighter mb-4">
            O que você quer <span className="text-primary italic">comer hoje?</span>
          </h1>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">
            Explore as melhores opções da cidade organizadas por categoria para facilitar sua escolha.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link href={`/categoria/${cat.id}`} key={cat.id}>
                <div className="group relative bg-white dark:bg-card-dark p-8 rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-white/5 overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                    <Sparkles size={120} />
                  </div>
                  
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {cat.icon}
                  </div>
                  
                  <h3 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-4 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    Explorar <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoriesIndexPage;

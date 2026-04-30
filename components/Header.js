import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, MapPin, Sun, Moon, LayoutGrid, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useRouter } from 'next/router';

const Header = () => {
  const { cartCount } = useCart();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  // Debounce para Autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [resProducts, resRestaurants] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/products/search?q=${encodeURIComponent(searchQuery)}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/restaurantes?q=${encodeURIComponent(searchQuery)}`)
        ]);
        
        const combined = [
          ...resRestaurants.data.map(r => ({ ...r, isRestaurant: true })),
          ...resProducts.data
        ];
        
        setSuggestions(combined.slice(0, 5)); // Limite de 5 itens
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Evita sobrecarga (só chama API após 300ms que parou de digitar)
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Lógica de Persistência do Tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-gray-100 dark:border-white/5 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Menu & Logo */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
              title="Menu Principal"
            >
              <LayoutGrid size={24} />
            </button>
            
            <Link href="/">
              <span className="text-2xl font-black text-primary tracking-tighter cursor-pointer flex items-center gap-1">
                Food<span className="text-secondary-light dark:text-secondary-dark">Hub</span>
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
              </span>
            </Link>

            <Link href="/explore">
              <span className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white font-black rounded-full cursor-pointer transition-all transform hover:scale-105 shadow-sm">
                <Compass size={18} />
                Explorar Categorias
              </span>
            </Link>


          </div>

          {/* Busca com Autocomplete */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowSuggestions(false);
              if(searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            }} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchQuery.trim()) setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="O que você quer comer?"
                className="w-full bg-gray-100/50 dark:bg-white/5 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all text-secondary-light dark:text-secondary-dark"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={18} onClick={() => {
                setShowSuggestions(false);
                if(searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
              }} />
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-card-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500 font-bold">Buscando...</div>
                  ) : suggestions.length > 0 ? (
                    <div>
                      {suggestions.map((item) => (
                        <div 
                          key={item.isRestaurant ? `rest-${item.id}` : `${item.restaurante_id}-${item.id}`} 
                          onClick={() => {
                            setSearchQuery(item.nome);
                            setShowSuggestions(false);
                            if (item.isRestaurant) {
                              router.push(`/restaurant/${item.id}`);
                            } else {
                              router.push(`/search?q=${encodeURIComponent(item.nome)}`);
                            }
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-gray-50 dark:border-white/5 last:border-none"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            <img 
                              src={item.logo_url || item.imagem_url || item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} 
                              alt={item.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-secondary-light dark:text-secondary-dark truncate">{item.nome}</p>
                            <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">
                              {item.isRestaurant ? 'Restaurante' : item.restaurante_nome}
                            </p>
                          </div>
                          {!item.isRestaurant && (
                            <span className="text-sm font-black text-primary">R$ {Number(item.preco).toFixed(2)}</span>
                          )}
                        </div>
                      ))}
                      <div 
                        onClick={() => {
                           setShowSuggestions(false);
                           router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="p-3 text-center bg-primary/5 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white cursor-pointer transition-colors"
                      >
                        Ver todos os resultados
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm font-black text-gray-500">Produto não encontrado</p>
                      <p className="text-xs text-gray-400 mt-1">Tente buscar por termos mais genéricos.</p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link href="/profile">
              <div className="flex items-center gap-2 text-secondary-light dark:text-secondary-dark font-bold hover:text-primary transition-colors cursor-pointer">
                <User size={20} />
                <span className="hidden sm:inline">Perfil</span>
              </div>
            </Link>

            {isAuthenticated ? (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/login');
                }}
                className="hidden md:block px-4 py-2 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              >
                Sair
              </button>
            ) : (
              <Link href="/register">
                <button className="hidden md:block px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer">
                  Cadastre-se grátis
                </button>
              </Link>
            )}

            <Link href="/cart">
              <div className="relative p-3 bg-primary text-white rounded-2xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/20">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
export default Header;

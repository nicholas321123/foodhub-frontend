import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, Clock, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRouter } from 'next/router';

const ProductCard = ({ product, showRestaurant = false }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(product.id, 'product');

  const price = Number(product.preco || product.price || 0);

  return (
    <div className="card-premium group flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.imagem_url || product.image_url || product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
          alt={product.nome || product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <button 
          onClick={() => toggleFavorite(product, 'product')}
          className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-lg z-10 ${
            favorited 
              ? 'bg-primary text-white scale-110' 
              : 'bg-white/20 text-white hover:bg-primary'
          }`}
        >
          <Heart size={20} fill={favorited ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
        {showRestaurant && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <Utensils size={14} className="text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider truncate max-w-[120px]">
              {product.restaurante_nome}
            </span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
          <Clock size={12} />
          <span>{product.tempo_estimado_entrega ? `${product.tempo_estimado_entrega} MIN` : '30-45 MIN'}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-black text-lg text-secondary-light dark:text-secondary-dark line-clamp-1 group-hover:text-primary transition-colors">
            {product.nome || product.name}
          </h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">
          {product.descricao || product.description || 'Delicioso prato preparado com ingredientes selecionados e muito carinho.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-primary leading-none">
              <span className="text-sm font-bold mr-1">R$</span>
              {price.toFixed(2)}
            </span>
            {showRestaurant && (
              <Link href={`/restaurant/${product.restaurante_id}`}>
                <span className="text-[10px] font-bold text-gray-400 hover:text-primary cursor-pointer mt-1 underline decoration-primary/30">
                  Ver Restaurante
                </span>
              </Link>
            )}
          </div>
          <button 
            onClick={() => {
              addToCart(product);
              router.push('/cart');
            }}
            className="p-3 bg-gray-100 dark:bg-white/5 text-secondary-light dark:text-secondary-dark rounded-2xl hover:bg-primary hover:text-white transition-all active:scale-90 shadow-sm"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

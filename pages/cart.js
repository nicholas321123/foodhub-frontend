import React from 'react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <div className="bg-white dark:bg-card-dark p-12 rounded-[40px] shadow-premium dark:shadow-premium-dark inline-block max-w-lg border border-gray-100 dark:border-white/5">
            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-gray-300 dark:text-gray-700" />
            </div>
            <h1 className="text-3xl font-black text-secondary-light dark:text-secondary-dark mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-500 mb-8 font-medium">Parece que você ainda não escolheu seu lanche de hoje. Que tal dar uma olhada no menu?</p>
            <Link href="/">
              <button className="btn-primary w-full">Voltar para a Home</button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <Link href="/">
          <div className="flex items-center gap-2 mb-8 text-gray-500 hover:text-primary cursor-pointer transition-all w-fit group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Continuar comprando</span>
          </div>
        </Link>

        <h1 className="text-4xl font-black text-secondary-light dark:text-secondary-dark mb-10 tracking-tighter">Meu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-premium dark:shadow-premium-dark flex items-center gap-6 border border-gray-100 dark:border-white/5">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="font-black text-secondary-light dark:text-secondary-dark text-xl">{item.name}</h3>
                    <span className="font-black text-xl text-primary mt-1 sm:mt-0">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-2xl p-1 border border-gray-200/50 dark:border-white/5">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-secondary-light dark:text-secondary-dark active:scale-90"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-black text-secondary-light dark:text-secondary-dark">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-secondary-light dark:text-secondary-dark active:scale-90"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="bg-white dark:bg-card-dark p-8 rounded-[40px] shadow-premium dark:shadow-premium-dark h-fit sticky top-24 border border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-8">Resumo</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Subtotal</span>
                <span className="text-secondary-light dark:text-secondary-dark">R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Taxa de entrega</span>
                <span className="text-green-500">GRÁTIS</span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-white/5 my-6"></div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-light dark:text-secondary-dark font-black text-xl">Total</span>
                <span className="text-primary font-black text-3xl tracking-tighter">R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <button className="btn-primary w-full text-lg py-4">
                Finalizar Pedido
              </button>
            </Link>

            <p className="mt-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Ao continuar você aceita nossos <br/> Termos e Condições.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;

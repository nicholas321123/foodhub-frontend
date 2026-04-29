import React, { useState } from 'react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { Truck, CreditCard, CheckCircle, MapPin, User, Phone } from 'lucide-react';
import Link from 'next/link';

const CheckoutPage = () => {
  const { cartTotal, clearCart } = useCart();
  const [isFinished, setIsFinished] = useState(false);

  const handleFinishOrder = (e) => {
    e.preventDefault();
    setIsFinished(true);
    clearCart();
  };

  if (isFinished) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <div className="bg-white dark:bg-card-dark p-12 rounded-[40px] shadow-premium dark:shadow-premium-dark inline-block max-w-lg border border-gray-100 dark:border-white/5">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
              <CheckCircle size={56} />
            </div>
            <h1 className="text-3xl font-black text-secondary-light dark:text-secondary-dark mb-4 tracking-tighter">Pedido Recebido!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Seu pedido #8472 foi recebido e já está sendo preparado.</p>
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Tempo estimado: <span className="font-black text-secondary-light dark:text-secondary-dark">35 min</span></p>
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
        <h1 className="text-4xl sm:text-5xl font-black text-secondary-light dark:text-secondary-dark mb-14 text-center tracking-tighter">Finalizar Pedido</h1>

        <form onSubmit={handleFinishOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Dados e Entrega */}
          <div className="space-y-8">
            <section className="bg-white dark:bg-card-dark p-8 rounded-[40px] shadow-premium dark:shadow-premium-dark border border-gray-100 dark:border-white/5">
              <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-xl"><User className="text-primary" size={24} /></div>
                Meus Dados
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome Completo</label>
                  <input required type="text" placeholder="Ex: Nicolas Silva" className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 text-secondary-light dark:text-secondary-dark transition-all placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Celular / WhatsApp</label>
                  <input required type="tel" placeholder="(11) 99999-9999" className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 text-secondary-light dark:text-secondary-dark transition-all placeholder:text-gray-400" />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-card-dark p-8 rounded-[40px] shadow-premium dark:shadow-premium-dark border border-gray-100 dark:border-white/5">
              <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-xl"><MapPin className="text-primary" size={24} /></div>
                Endereço de Entrega
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Rua / Avenida</label>
                  <input required type="text" placeholder="Ex: Av. Paulista" className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 text-secondary-light dark:text-secondary-dark transition-all placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Número</label>
                  <input required type="text" placeholder="123" className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 text-secondary-light dark:text-secondary-dark transition-all placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Bairro</label>
                  <input required type="text" placeholder="Centro" className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 text-secondary-light dark:text-secondary-dark transition-all placeholder:text-gray-400" />
                </div>
              </div>
            </section>
          </div>

          {/* Pagamento e Total */}
          <div className="space-y-8">
            <section className="bg-white dark:bg-card-dark p-8 rounded-[40px] shadow-premium dark:shadow-premium-dark border border-gray-100 dark:border-white/5">
              <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-xl"><CreditCard className="text-primary" size={24} /></div>
                Pagamento
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="border-2 border-primary bg-primary/5 rounded-3xl p-6 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
                  <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-primary focus:ring-primary" />
                  <span className="font-black text-secondary-light dark:text-secondary-dark">Cartão Online</span>
                </label>
                <label className="border-2 border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 rounded-3xl p-6 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95 group">
                  <input type="radio" name="payment" className="w-5 h-5 text-primary focus:ring-primary" />
                  <span className="font-black text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">Pix</span>
                </label>
                <label className="border-2 border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 rounded-3xl p-6 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95 group">
                  <input type="radio" name="payment" className="w-5 h-5 text-primary focus:ring-primary" />
                  <span className="font-black text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">Cartão na entrega</span>
                </label>
                <label className="border-2 border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 rounded-3xl p-6 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95 group">
                  <input type="radio" name="payment" className="w-5 h-5 text-primary focus:ring-primary" />
                  <span className="font-black text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">Dinheiro</span>
                </label>
              </div>
            </section>

            <section className="bg-white dark:bg-card-dark p-8 rounded-[40px] shadow-premium dark:shadow-premium-dark border border-gray-100 dark:border-white/5 text-center">
              <div className="flex flex-col gap-2 mb-10">
                <span className="text-gray-400 font-black uppercase tracking-widest text-xs">Total do Pedido</span>
                <span className="text-6xl font-black text-primary tracking-tighter">R$ {cartTotal.toFixed(2)}</span>
              </div>
              <button type="submit" className="btn-primary w-full py-6 text-xl uppercase tracking-widest shadow-2xl shadow-primary/30 active:scale-95 hover:scale-[1.02]">
                Confirmar Pedido
              </button>
              <div className="mt-8 flex items-center justify-center gap-3 text-green-500 font-black text-sm uppercase tracking-widest">
                <Truck size={20} />
                <span>Frete Grátis Ativado</span>
              </div>
            </section>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;

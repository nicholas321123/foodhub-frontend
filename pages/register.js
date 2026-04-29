import React, { useState } from 'react';
import Header from '../components/Header';
import { Mail, Lock, User, Phone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/register`, formData);
      toast.success('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      <ToastContainer position="bottom-right" theme="colored" />
      <main className="container mx-auto px-4 flex justify-center py-10 md:py-20">
        <div className="bg-white dark:bg-card-dark rounded-[48px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-100 dark:border-white/5">
          <div className="bg-primary p-12 text-white text-center relative overflow-hidden">
            <Sparkles className="absolute -top-10 -right-10 opacity-20" size={150} />
            <h1 className="text-4xl font-black mb-2 tracking-tighter">Cadastre-se</h1>
            <p className="text-white/80 font-medium">Junte-se ao FoodHub e peça o melhor da sua cidade.</p>
          </div>
          
          <form className="p-10 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    type="text" 
                    placeholder="Seu nome"
                    required
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary-light dark:text-secondary-dark placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    type="tel" 
                    placeholder="(00) 00000-0000"
                    required
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary-light dark:text-secondary-dark placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="relative md:col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    placeholder="seuemail@exemplo.com"
                    required
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary-light dark:text-secondary-dark placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="relative md:col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary-light dark:text-secondary-dark placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-5 text-lg font-black tracking-widest mt-4 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CADASTRANDO...' : 'CRIAR MINHA CONTA'}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-500 font-bold text-sm">
                Já tem uma conta? <Link href="/login"><span className="text-primary cursor-pointer hover:underline">Fazer login</span></Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;

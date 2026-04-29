import React, { useState } from 'react';
import Header from '../components/Header';
import { Mail, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Login bem-sucedido!');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <ToastContainer position="bottom-right" theme="colored" />
      <Header />
      <main className="container mx-auto px-4 flex justify-center py-20">
        <div className="bg-white dark:bg-card-dark rounded-[48px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-gray-100 dark:border-white/5">
          <div className="bg-primary p-12 text-white text-center relative overflow-hidden">
            <Sparkles className="absolute -top-10 -right-10 opacity-20" size={150} />
            <h1 className="text-4xl font-black mb-2 tracking-tighter">Bem-vindo!</h1>
            <p className="text-white/80 font-medium">Faça login para saborear o que há de melhor.</p>
          </div>
          
          <form className="p-10 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="email"
                    type="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary-light dark:text-secondary-dark placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="password"
                    type="password" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary-light dark:text-secondary-dark placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-primary transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary bg-gray-100 dark:bg-white/5 border-none" />
                Lembrar de mim
              </label>
              <Link href="/forgot-password">
                <span className="text-primary hover:underline cursor-pointer">Esqueci a senha</span>
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-lg font-black tracking-widest mt-4 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'ENTRANDO...' : 'ENTRAR NO APP'}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-500 font-bold text-sm">
                Não tem uma conta? <Link href="/register"><span className="text-primary cursor-pointer hover:underline">Cadastre-se grátis</span></Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import Header from '../components/Header';
import { Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não coincidem!');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/reset-password`, formData);
      toast.success(response.data.message || 'Senha redefinida com sucesso! Você já pode fazer login.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao redefinir a senha. Tente novamente.');
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
            <div className="absolute top-6 left-6 cursor-pointer hover:scale-110 transition-transform" onClick={() => router.push('/login')}>
              <ArrowLeft size={24} />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tighter mt-4">Recuperar Senha</h1>
            <p className="text-white/80 font-medium text-sm">Insira seu e-mail e a nova senha desejada.</p>
          </div>
          
          <form className="p-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail Cadastrado</label>
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
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="newPassword"
                    type="password" 
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary-light dark:text-secondary-dark placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="confirmPassword"
                    type="password" 
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary-light dark:text-secondary-dark placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-lg font-black tracking-widest mt-4 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'REDEFININDO...' : 'REDEFINIR SENHA'}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-500 font-bold text-sm">
                Lembrou a senha? <Link href="/login"><span className="text-primary cursor-pointer hover:underline">Voltar ao login</span></Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { ShieldAlert, Trash2, Edit, Plus, Store, Package } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('restaurantes');
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Modals/Forms
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'restaurant' or 'product'
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user.id !== 1 || user.tipo !== 'admin') {
      router.push('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRestaurants, resProducts, resCategories] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/restaurantes?admin=1`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/products?admin=1`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/categories`)
      ]);
      setRestaurants(resRestaurants.data);
      setProducts(resProducts.data);
      setCategories(resCategories.data);
    } catch (error) {
      console.error('Erro ao buscar dados do painel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const endpoint = type === 'restaurant' ? 'restaurantes' : 'products';
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${endpoint}/${id}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const endpoint = modalType === 'restaurant' ? 'restaurantes' : 'products';
      if (editingData.id) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${endpoint}/${editingData.id}`, editingData);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${endpoint}`, editingData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === 'restaurant') {
      setEditingData(data || { nome: '', cnpj: '', telefone: '', endereco: '', logo_url: '', tempo_estimado_entrega: '', status: 'aberto' });
    } else {
      setEditingData(data || { nome: '', descricao: '', preco: '', imagem_url: '', restaurante_id: '', categoria_id: '', ativo: 1 });
    }
    setShowModal(true);
  };

  if (loading) return <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-secondary-light dark:text-secondary-dark tracking-tighter">Painel de Controle</h1>
            <p className="text-gray-500 font-medium">Gestão total do sistema FoodHub</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Total Restaurantes</p>
            <h3 className="text-4xl font-black text-secondary-light dark:text-secondary-dark">{restaurants.length}</h3>
          </div>
          <div className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Total Produtos</p>
            <h3 className="text-4xl font-black text-secondary-light dark:text-secondary-dark">{products.length}</h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('restaurantes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'restaurantes' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-primary'}`}
          >
            <Store size={18} /> Restaurantes
          </button>
          <button 
            onClick={() => setActiveTab('produtos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'produtos' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-primary'}`}
          >
            <Package size={18} /> Produtos
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-card-dark rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-secondary-light dark:text-secondary-dark">
              {activeTab === 'restaurantes' ? 'Gerenciar Restaurantes' : 'Gerenciar Produtos'}
            </h2>
            <button 
              onClick={() => openModal(activeTab === 'restaurantes' ? 'restaurant' : 'product')}
              className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl font-bold transition-all"
            >
              <Plus size={18} />
              Novo {activeTab === 'restaurantes' ? 'Restaurante' : 'Produto'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Nome</th>
                  {activeTab === 'restaurantes' ? (
                    <>
                      <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Telefone</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Preço</th>
                      <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Restaurante</th>
                    </>
                  )}
                  <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'restaurantes' ? restaurants : products).map(item => (
                  <tr key={item.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-4 text-sm font-bold text-gray-500">#{item.id}</td>
                    <td className="py-4 font-bold text-secondary-light dark:text-secondary-dark">
                      <div className="flex items-center gap-3">
                        <img src={item.logo_url || item.imagem_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={item.nome} className="w-10 h-10 rounded-lg object-cover" />
                        {item.nome}
                      </div>
                    </td>
                    {activeTab === 'restaurantes' ? (
                      <>
                        <td className="py-4">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${item.status === 'aberto' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-500 font-medium">{item.telefone || '-'}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 text-sm font-bold text-primary">R$ {Number(item.preco).toFixed(2)}</td>
                        <td className="py-4 text-sm text-gray-500 font-medium">{item.restaurante_nome}</td>
                      </>
                    )}
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(activeTab === 'restaurantes' ? 'restaurant' : 'product', item)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(item.id, activeTab === 'restaurantes' ? 'restaurant' : 'product')} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card-dark rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black text-secondary-light dark:text-secondary-dark">
                {editingData.id ? 'Editar' : 'Novo'} {modalType === 'restaurant' ? 'Restaurante' : 'Produto'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              {modalType === 'restaurant' ? (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome</label>
                      <input type="text" required value={editingData.nome} onChange={e => setEditingData({...editingData, nome: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                      <select value={editingData.status} onChange={e => setEditingData({...editingData, status: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary">
                        <option value="aberto">Aberto</option>
                        <option value="fechado">Fechado</option>
                      </select>
                    </div>
                  </div>
                  <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Logo URL</label>
                      <input type="text" value={editingData.logo_url} onChange={e => setEditingData({...editingData, logo_url: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">CNPJ</label>
                      <input type="text" value={editingData.cnpj} onChange={e => setEditingData({...editingData, cnpj: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Telefone</label>
                      <input type="text" value={editingData.telefone} onChange={e => setEditingData({...editingData, telefone: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Est. Entrega (min)</label>
                      <input type="text" value={editingData.tempo_estimado_entrega} onChange={e => setEditingData({...editingData, tempo_estimado_entrega: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Endereço</label>
                      <input type="text" value={editingData.endereco} onChange={e => setEditingData({...editingData, endereco: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Produto</label>
                      <input type="text" required value={editingData.nome} onChange={e => setEditingData({...editingData, nome: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Preço (R$)</label>
                      <input type="number" step="0.01" required value={editingData.preco} onChange={e => setEditingData({...editingData, preco: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Descrição</label>
                      <textarea value={editingData.descricao} onChange={e => setEditingData({...editingData, descricao: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" rows="3"></textarea>
                  </div>
                  <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Imagem URL</label>
                      <input type="text" value={editingData.imagem_url} onChange={e => setEditingData({...editingData, imagem_url: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Restaurante</label>
                      <select required value={editingData.restaurante_id} onChange={e => setEditingData({...editingData, restaurante_id: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary">
                        <option value="">Selecione...</option>
                        {restaurants.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Categoria</label>
                      <select required value={editingData.categoria_id} onChange={e => setEditingData({...editingData, categoria_id: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary">
                        <option value="">Selecione...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ativo?</label>
                      <select value={editingData.ativo} onChange={e => setEditingData({...editingData, ativo: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary">
                        <option value={1}>Sim</option>
                        <option value={0}>Não</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700">Cancelar</button>
                <button type="submit" className="btn-primary px-8">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

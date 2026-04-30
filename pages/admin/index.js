import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { ShieldAlert, Trash2, Edit, Plus, Store, Package, Layers } from 'lucide-react';
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
  const [modalType, setModalType] = useState(''); // 'restaurant', 'product', 'category'
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
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/restaurantes?admin=1`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products?admin=1`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/categories`)
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
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sessão inválida. Por favor, faça login novamente.');
      window.location.href = '/login';
      return;
    }

    try {
      const endpointMap = {
        'restaurante': 'restaurantes',
        'restaurant': 'restaurantes',
        'produto': 'products',
        'product': 'products',
        'categoria': 'categories',
        'category': 'categories'
      };
      
      const endpoint = endpointMap[type] || 'categories';
      
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      if (error.response?.status === 401) {
        alert('Sua sessão expirou. Você será redirecionado para o login.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Erro ao excluir: ' + (error.response?.data?.error || 'Verifique a conexão com o servidor.'));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sessão inválida. Por favor, faça login novamente.');
      window.location.href = '/login';
      return;
    }

    try {
      const endpointMap = {
        'restaurante': 'restaurantes',
        'restaurant': 'restaurantes',
        'produto': 'products',
        'product': 'products',
        'categoria': 'categories',
        'category': 'categories'
      };
      
      const endpoint = endpointMap[modalType] || 'categories';

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingData.id) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${endpoint}/${editingData.id}`, editingData, config);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${endpoint}`, editingData, config);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      if (error.response?.status === 401) {
        alert('Sua sessão expirou. Você será redirecionado para o login.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Erro ao salvar: ' + (error.response?.data?.error || 'Verifique se todos os campos obrigatórios estão preenchidos.'));
      }
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === 'restaurant') {
      setEditingData(data || { nome: '', responsavel: '', cnpj: '', telefone: '', endereco: '', logo_url: '', tempo_estimado_entrega: '', status: 'aberto' });
    } else if (type === 'product') {
      setEditingData(data || { nome: '', descricao: '', preco: '', imagem_url: '', restaurante_id: '', categoria_id: '', ativo: 1, opcoes: [] });
    } else {
      setEditingData(data || { nome: '', restaurante_id: '', ordem: 0 });
    }
    setShowModal(true);
  };

  const addOption = () => {
    const newOptions = [...(editingData.opcoes || []), { label: '', preco: '' }];
    setEditingData({ ...editingData, opcoes: newOptions });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...editingData.opcoes];
    newOptions[index][field] = value;
    setEditingData({ ...editingData, opcoes: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = editingData.opcoes.filter((_, i) => i !== index);
    setEditingData({ ...editingData, opcoes: newOptions });
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
          <button 
            onClick={() => setActiveTab('categorias')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'categorias' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-primary'}`}
          >
            <Layers size={18} /> Categorias
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-card-dark rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-secondary-light dark:text-secondary-dark uppercase tracking-tighter">
              {activeTab === 'restaurantes' ? 'Gerenciar Restaurantes' : activeTab === 'produtos' ? 'Gerenciar Produtos' : 'Gerenciar Categorias'}
            </h2>
            <button 
              onClick={() => openModal(activeTab === 'restaurantes' ? 'restaurant' : activeTab === 'produtos' ? 'product' : 'category')}
              className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl font-bold transition-all"
            >
              <Plus size={18} />
              Novo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Nome</th>
                  {activeTab === 'restaurantes' ? (
                    <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Responsável</th>
                  ) : activeTab === 'produtos' ? (
                    <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Preço Base</th>
                  ) : (
                    <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Restaurante</th>
                  )}
                  <th className="py-4 font-black text-xs text-gray-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'restaurantes' ? restaurants : activeTab === 'produtos' ? products : categories).map(item => (
                  <tr key={item.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-4 text-sm font-bold text-gray-500">#{item.id}</td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-secondary-light dark:text-secondary-dark">{item.nome}</span>
                        {activeTab === 'produtos' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-lg uppercase tracking-widest">
                              {item.restaurante_nome || 'Sem Restaurante'}
                            </span>
                            <span className="text-[10px] font-black bg-gray-100 dark:bg-white/10 text-gray-400 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                              {item.categoria_nome || 'Sem Categoria'}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500 font-medium">
                      {activeTab === 'restaurantes' ? item.responsavel : activeTab === 'produtos' ? `R$ ${Number(item.preco).toFixed(2)}` : (restaurants.find(r => r.id === item.restaurante_id)?.nome || 'Global')}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(activeTab.slice(0, -1), item)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(item.id, activeTab.slice(0, -1))} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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
                {editingData.id ? 'Editar' : 'Novo'} {modalType === 'restaurant' ? 'Restaurante' : modalType === 'product' ? 'Produto' : 'Categoria'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              {modalType === 'restaurant' ? (
                <>
                   <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Restaurante</label>
                      <input type="text" required value={editingData.nome} onChange={e => setEditingData({...editingData, nome: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Responsável</label>
                      <input type="text" required value={editingData.responsavel} onChange={e => setEditingData({...editingData, responsavel: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                      <select value={editingData.status} onChange={e => setEditingData({...editingData, status: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary">
                        <option value="aberto">Aberto</option>
                        <option value="fechado">Fechado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Logo URL</label>
                      <input type="text" value={editingData.logo_url} onChange={e => setEditingData({...editingData, logo_url: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">CNPJ</label>
                      <input type="text" required value={editingData.cnpj} onChange={e => setEditingData({...editingData, cnpj: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Telefone</label>
                      <input type="text" value={editingData.telefone} onChange={e => setEditingData({...editingData, telefone: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Est. Entrega</label>
                      <input type="text" value={editingData.tempo_estimado_entrega} onChange={e => setEditingData({...editingData, tempo_estimado_entrega: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                </>
              ) : modalType === 'product' ? (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Produto</label>
                      <input type="text" required value={editingData.nome} onChange={e => setEditingData({...editingData, nome: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Preço Base (R$)</label>
                      <input type="number" step="0.01" required value={editingData.preco} onChange={e => setEditingData({...editingData, preco: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Restaurante</label>
                      <select required value={editingData.restaurante_id} onChange={e => setEditingData({...editingData, restaurante_id: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary">
                        <option value="">Selecione...</option>
                        {restaurants.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Categoria (Nicho)</label>
                      <select required value={editingData.categoria_id} onChange={e => setEditingData({...editingData, categoria_id: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary">
                        <option value="">Selecione...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Opções de Tamanho (P, M, G) */}
                  <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-black text-secondary-light dark:text-secondary-dark uppercase tracking-widest">Tamanhos / Opções (P, M, G)</h4>
                      <button type="button" onClick={addOption} className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                        <Plus size={14} /> Adicionar Opção
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {(editingData.opcoes || []).map((opt, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <input 
                            placeholder="Ex: P ou M" 
                            value={opt.label} 
                            onChange={e => updateOption(idx, 'label', e.target.value)}
                            className="flex-1 bg-white dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold"
                          />
                          <input 
                            placeholder="Preço R$" 
                            type="number"
                            value={opt.preco} 
                            onChange={e => updateOption(idx, 'preco', e.target.value)}
                            className="w-32 bg-white dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold"
                          />
                          <button type="button" onClick={() => removeOption(idx)} className="text-red-500 p-2"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      {(!editingData.opcoes || editingData.opcoes.length === 0) && (
                        <p className="text-xs text-gray-400 italic">Nenhuma variação de tamanho adicionada.</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Nicho (Categoria)</label>
                    <input type="text" required value={editingData.nome} onChange={e => setEditingData({...editingData, nome: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary" placeholder="Ex: Pizzas, Bebidas, Sobremesas" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Restaurante Vinculado (Opcional)</label>
                    <select value={editingData.restaurante_id} onChange={e => setEditingData({...editingData, restaurante_id: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-4 font-bold text-secondary-light dark:text-secondary-dark focus:ring-2 focus:ring-primary">
                      <option value="">Global (Disponível para todos)</option>
                      {restaurants.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700">Cancelar</button>
                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

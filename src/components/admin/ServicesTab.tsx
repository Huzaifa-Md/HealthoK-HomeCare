'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Service } from '@/lib/types';
import toast from 'react-hot-toast';
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, X, GripVertical, Loader2, Search } from 'lucide-react';

const FIXED_CATEGORIES = [
  'Nursing Procedures',
  'Injection Services',
  'Vaccination',
  'Health Check-up Packages',
  'Lab Tests'
];

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    service_name: '', 
    category: FIXED_CATEGORIES[0],
    description: '', 
    is_active: true, 
  });
  
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
    if (error) toast.error('Failed to load services');
    else setServices(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_name.trim() || !formData.category) {
      toast.error('Name and Category are required');
      return;
    }

    if (editingId) {
      const { error } = await supabase.from('services').update({
        service_name: formData.service_name,
        category: formData.category,
        description: formData.description,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      }).eq('id', editingId);
      
      if (error) toast.error('Failed to update service');
      else { toast.success('Service updated'); setEditingId(null); }
    } else {
      // Find max display order for this category
      const categoryServices = services.filter(s => s.category === formData.category);
      const maxOrder = categoryServices.length > 0 ? Math.max(...categoryServices.map(s => s.display_order)) : 0;
      
      const { error } = await supabase.from('services').insert([{
        service_name: formData.service_name,
        category: formData.category,
        description: formData.description,
        is_active: formData.is_active,
        display_order: maxOrder + 1
      }]);
      
      if (error) toast.error('Failed to add service');
      else { toast.success('Service added'); setShowAdd(false); }
    }
    
    setFormData({ service_name: '', category: FIXED_CATEGORIES[0], description: '', is_active: true });
    fetchData();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('services').update({ is_active: !currentStatus }).eq('id', id);
    if (error) toast.error('Failed to toggle status');
    else { toast.success(`Service ${!currentStatus ? 'activated' : 'hidden'}`); fetchData(); }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) toast.error('Failed to delete service');
    else { toast.success('Service deleted'); fetchData(); }
  };

  // Drag and drop within the SAME category only
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.getElementById(`srv-${id}`);
      if (el) el.style.opacity = '0.4';
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropTargetId: string, categoryName: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === dropTargetId) {
      if (draggedId) {
        const el = document.getElementById(`srv-${draggedId}`);
        if (el) el.style.opacity = '1';
      }
      setDraggedId(null);
      return;
    }

    const draggedService = services.find(s => s.id === draggedId);
    if (draggedService?.category !== categoryName) {
      toast.error('You can only reorder services within the same category');
      const el = document.getElementById(`srv-${draggedId}`);
      if (el) el.style.opacity = '1';
      setDraggedId(null);
      return;
    }

    const newServices = [...services];
    const catServices = newServices.filter(s => s.category === categoryName).sort((a,b) => a.display_order - b.display_order);
    
    const draggedIdx = catServices.findIndex(s => s.id === draggedId);
    const dropIdx = catServices.findIndex(s => s.id === dropTargetId);
    
    const [draggedItem] = catServices.splice(draggedIdx, 1);
    catServices.splice(dropIdx, 0, draggedItem);
    
    // Update display orders
    const updates = catServices.map((s, index) => ({ id: s.id, display_order: index }));
    
    // Optimistic UI update
    const updatedServices = newServices.map(s => {
      const update = updates.find(u => u.id === s.id);
      return update ? { ...s, display_order: update.display_order } : s;
    });
    setServices(updatedServices);
    
    const el = document.getElementById(`srv-${draggedId}`);
    if (el) el.style.opacity = '1';
    setDraggedId(null);

    // DB Persistence
    for (const update of updates) {
      await supabase.from('services').update({ display_order: update.display_order }).eq('id', update.id);
    }
    toast.success('Order updated');
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.service_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'all' || s.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-admin-text">Manage Services</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-admin-card border border-admin-border text-sm text-admin-text outline-none focus:border-primary"
            />
          </div>
          <select 
            value={activeCategoryFilter} 
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-admin-card border border-admin-border text-sm text-admin-text outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            {FIXED_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button 
            onClick={() => {
              setShowAdd(!showAdd);
              setEditingId(null);
              setFormData({ 
                service_name: '', 
                category: activeCategoryFilter === 'all' ? FIXED_CATEGORIES[0] : activeCategoryFilter, 
                description: '', 
                is_active: true
              });
            }} 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all w-full sm:w-auto shrink-0"
          >
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span className="hidden sm:inline">{showAdd ? 'Cancel' : 'Add Service'}</span>
          </button>
        </div>
      </div>

      {(showAdd || editingId) && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-admin-card border border-admin-border shadow-sm space-y-4 animate-fade-in-up">
          <h3 className="font-bold text-admin-text">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">Service Name *</label>
              <input required type="text" value={formData.service_name} onChange={(e) => setFormData({...formData, service_name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">Category *</label>
              <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary">
                <option value="" disabled>Select a category</option>
                {FIXED_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-admin-text-muted mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary resize-none" />
          </div>

          <div>
            <label className="block text-sm text-admin-text-muted mb-1">Status</label>
            <select value={formData.is_active ? 'active' : 'hidden'} onChange={(e) => setFormData({...formData, is_active: e.target.value === 'active'})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary">
              <option value="active">Active (Visible)</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          
          <button type="submit" className="mt-4 px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
            <Save className="w-4 h-4" /> Save Service
          </button>
        </form>
      )}

      <div className="space-y-8">
        {FIXED_CATEGORIES.map(category => {
          if (activeCategoryFilter !== 'all' && activeCategoryFilter !== category) return null;
          
          const catServices = filteredServices.filter(s => s.category === category).sort((a,b) => a.display_order - b.display_order);
          if (catServices.length === 0 && searchQuery === '') return null; // Skip empty if no search

          return (
            <div key={category} className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden">
              <div className="bg-admin-bg px-4 py-3 border-b border-admin-border flex justify-between items-center">
                <h3 className="font-bold text-admin-text">{category}</h3>
                <span className="text-xs font-semibold text-admin-text-muted bg-admin-card px-2 py-1 rounded-md border border-admin-border">{catServices.length} Services</span>
              </div>
              <div className="p-2 space-y-2">
                {catServices.map(srv => (
                  <div 
                    key={srv.id}
                    id={`srv-${srv.id}`}
                    draggable={searchQuery === ''} // Only allow drag if not searching
                    onDragStart={(e) => handleDragStart(e, srv.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, srv.id, category)}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-admin-card border border-admin-border transition-all ${searchQuery === '' ? 'cursor-move hover:shadow-sm' : ''} ${!srv.is_active ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-0">
                      {searchQuery === '' && <GripVertical className="w-4 h-4 text-admin-text-muted mt-1 sm:mt-0" />}
                      <div>
                        <h4 className="font-semibold text-admin-text text-sm">{srv.service_name}</h4>
                        <p className="text-admin-text-muted text-xs line-clamp-1 max-w-md mt-0.5">{srv.description || 'No description'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${srv.is_active ? 'bg-success/10 text-success' : 'bg-admin-bg text-admin-text-muted border border-admin-border'}`}>
                        {srv.is_active ? 'Active' : 'Hidden'}
                      </span>
                      <div className="h-4 w-px bg-admin-border mx-1 hidden sm:block"></div>
                      <button onClick={() => toggleActive(srv.id, srv.is_active)} className="p-1.5 rounded-lg bg-admin-bg border border-admin-border hover:bg-admin-card transition-colors text-admin-text" title={srv.is_active ? "Hide Service" : "Show Service"}>
                        {srv.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingId(srv.id);
                          setFormData({ 
                            service_name: srv.service_name, 
                            category: srv.category,
                            description: srv.description || '', 
                            is_active: srv.is_active
                          });
                          setShowAdd(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteService(srv.id)} className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {catServices.length === 0 && <p className="text-center text-admin-text-muted text-sm py-4">No services match your search.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

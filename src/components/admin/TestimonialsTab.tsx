'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/lib/types';
import toast from 'react-hot-toast';
import { Star, Plus, Edit3, Trash2, X, Loader2 } from 'lucide-react';

export default function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ customer_name: '', rating: 5, review: '' });
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editReviewData, setEditReviewData] = useState({ customer_name: '', rating: 5, review: '' });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Failed to load testimonials');
    else setTestimonials(data || []);
    setLoading(false);
  };

  const addReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('testimonials').insert([newReview]);
    if (error) toast.error('Failed to add review');
    else {
      toast.success('Review added');
      setShowAddReview(false);
      setNewReview({ customer_name: '', rating: 5, review: '' });
      fetchTestimonials();
    }
  };

  const updateReview = async (id: string) => {
    const { error } = await supabase.from('testimonials').update(editReviewData).eq('id', id);
    if (error) toast.error('Failed to update review');
    else {
      toast.success('Review updated');
      setEditingReview(null);
      fetchTestimonials();
    }
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) toast.error('Failed to delete review');
    else { toast.success('Review deleted'); fetchTestimonials(); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-admin-text">Testimonials</h2>
        <button onClick={() => setShowAddReview(!showAddReview)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
          {showAddReview ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span className="hidden sm:inline">{showAddReview ? 'Cancel' : 'Add Review'}</span>
        </button>
      </div>
      
      {showAddReview && (
        <form onSubmit={addReview} className="p-6 rounded-2xl bg-admin-card border border-admin-border shadow-lg space-y-4 animate-fade-in-up">
          <h3 className="font-bold text-admin-text">Add New Review</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">Customer Name</label>
              <input required type="text" value={newReview.customer_name} onChange={(e) => setNewReview({...newReview, customer_name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">Rating (1-5)</label>
              <input required type="number" min="1" max="5" value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-admin-text-muted mb-1">Review Message</label>
            <textarea required rows={3} value={newReview.review} onChange={(e) => setNewReview({...newReview, review: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary resize-none" />
          </div>
          <button type="submit" className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">Submit Review</button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="p-5 rounded-2xl bg-admin-card border border-admin-border hover:shadow-lg transition-all flex flex-col">
            {editingReview === t.id ? (
              <div className="space-y-3 flex-1">
                <input type="text" value={editReviewData.customer_name} onChange={(e) => setEditReviewData({...editReviewData, customer_name: e.target.value})} className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary" />
                <input type="number" min="1" max="5" value={editReviewData.rating} onChange={(e) => setEditReviewData({...editReviewData, rating: parseInt(e.target.value)})} className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary" />
                <textarea rows={3} value={editReviewData.review} onChange={(e) => setEditReviewData({...editReviewData, review: e.target.value})} className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary resize-none" />
                <div className="flex gap-2 pt-2">
                  <button onClick={() => updateReview(t.id)} className="flex-1 py-1.5 bg-success/10 text-success rounded-lg hover:bg-success/20 text-sm font-medium">Save</button>
                  <button onClick={() => setEditingReview(null)} className="flex-1 py-1.5 bg-admin-bg text-admin-text-muted rounded-lg hover:bg-admin-border text-sm font-medium">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingReview(t.id); setEditReviewData({ customer_name: t.customer_name, rating: t.rating, review: t.review }); }} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteReview(t.id)} className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-admin-text-muted text-sm mb-4 flex-1">&ldquo;{t.review}&rdquo;</p>
                <p className="font-semibold text-admin-text text-sm">— {t.customer_name}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {testimonials.length === 0 && !showAddReview && (
        <div className="text-center py-12 bg-admin-card rounded-2xl border border-admin-border">
          <p className="text-admin-text-muted mb-2">No reviews yet.</p>
        </div>
      )}
    </div>
  );
}

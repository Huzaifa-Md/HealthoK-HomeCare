'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Review } from '@/lib/types';
import toast from 'react-hot-toast';
import { Star, CheckCircle, XCircle, Trash2, Loader2, Award, Plus, X, Edit3, MapPin, Search, LayoutGrid, RotateCcw } from 'lucide-react';

type FilterType = 'all' | 'pending' | 'approved' | 'rejected' | 'demo' | 'featured';
type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Demo Review Form
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoForm, setDemoForm] = useState({
    patient_name: '',
    location: '',
    service_received: '',
    rating: 5,
    review_message: '',
    is_featured: false,
  });

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    patient_name: '',
    location: '',
    service_received: '',
    rating: 5,
    review_message: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to load reviews');
      console.error(error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  // --- Actions ---
  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'rejected' && !window.confirm('Are you sure you want to reject this review?')) return;
    
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
    if (error) toast.error(`Failed to update status`);
    else { toast.success(`Review status updated to ${status}`); fetchReviews(); }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('reviews').update({ is_featured: !currentStatus }).eq('id', id);
    if (error) toast.error('Failed to update featured status');
    else { toast.success(currentStatus ? 'Removed from featured' : 'Marked as featured'); fetchReviews(); }
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) toast.error('Failed to delete review');
    else { toast.success('Review deleted'); fetchReviews(); }
  };

  // --- Demo Review Add ---
  const addDemoReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitting(true);
    const { error } = await supabase.from('reviews').insert([{
      patient_name: demoForm.patient_name,
      location: demoForm.location,
      service_received: demoForm.service_received,
      rating: demoForm.rating,
      review_message: demoForm.review_message,
      status: 'approved',
      review_type: 'demo',
      is_featured: demoForm.is_featured,
    }]);
    if (error) toast.error('Failed to add demo review');
    else {
      toast.success('Demo review added');
      setShowDemoForm(false);
      setDemoForm({ patient_name: '', location: '', service_received: '', rating: 5, review_message: '', is_featured: false });
      fetchReviews();
    }
    setDemoSubmitting(false);
  };

  // --- Edit ---
  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setEditForm({
      patient_name: review.patient_name,
      location: review.location,
      service_received: review.service_received,
      rating: review.rating,
      review_message: review.review_message,
    });
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('reviews').update(editForm).eq('id', id);
    if (error) toast.error('Failed to update review');
    else { toast.success('Review updated'); setEditingId(null); fetchReviews(); }
  };

  // --- Stats Counts ---
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter(r => r.review_type === 'real' && r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.review_type === 'real' && r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.review_type === 'real' && r.status === 'rejected').length;
  const demoCount = reviews.filter(r => r.review_type === 'demo').length;
  const featuredCount = reviews.filter(r => r.is_featured).length;

  const validReviews = reviews.filter(r => r.status !== 'rejected');
  const avgRating = validReviews.length > 0 
    ? (validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1)
    : '0.0';

  // --- Filter, Search & Sort Logic ---
  let processedReviews = reviews.filter(r => {
    if (filter === 'pending') return r.review_type === 'real' && r.status === 'pending';
    if (filter === 'approved') return r.review_type === 'real' && r.status === 'approved';
    if (filter === 'rejected') return r.review_type === 'real' && r.status === 'rejected';
    if (filter === 'demo') return r.review_type === 'demo';
    if (filter === 'featured') return r.is_featured;
    return true;
  });

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    processedReviews = processedReviews.filter(r => 
      r.patient_name.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query) ||
      r.service_received.toLowerCase().includes(query)
    );
  }

  processedReviews.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return 0;
  });

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-admin-text">Reviews Management</h2>
        <button
          onClick={() => setShowDemoForm(!showDemoForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 hover:shadow-lg transition-all"
        >
          {showDemoForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showDemoForm ? 'Cancel' : 'Add Demo Review'}</span>
        </button>
      </div>

      {/* Demo Form (Collapsible) */}
      {showDemoForm && (
        <form onSubmit={addDemoReview} className="p-6 rounded-2xl bg-admin-card border border-admin-border shadow-lg space-y-4 animate-fade-in-up">
          <h3 className="font-bold text-admin-text flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Add Demo Review
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">Patient Name</label>
              <input required type="text" value={demoForm.patient_name} onChange={e => setDemoForm({...demoForm, patient_name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary" placeholder="Amit Sharma" />
            </div>
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">Location</label>
              <input required type="text" value={demoForm.location} onChange={e => setDemoForm({...demoForm, location: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary" placeholder="Raj Nagar Extension" />
            </div>
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">Service</label>
              <input required type="text" value={demoForm.service_received} onChange={e => setDemoForm({...demoForm, service_received: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary" placeholder="Nursing Procedures" />
            </div>
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">Rating (1-5)</label>
              <div className="flex gap-1 pt-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setDemoForm({...demoForm, rating: s})} className="focus:outline-none">
                    <Star className={`w-6 h-6 ${s <= demoForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-admin-text-muted mb-1">Review Message</label>
            <textarea required rows={3} value={demoForm.review_message} onChange={e => setDemoForm({...demoForm, review_message: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text outline-none focus:border-primary resize-none" placeholder="The nursing staff was extremely professional..." />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer" title="Featured reviews are highlighted and displayed first on the website homepage.">
              <input type="checkbox" checked={demoForm.is_featured} onChange={e => setDemoForm({...demoForm, is_featured: e.target.checked})} className="w-4 h-4 rounded border-admin-border text-primary focus:ring-primary" />
              <span className="text-sm text-admin-text-muted">⭐ Mark as Featured</span>
            </label>
          </div>
          <button type="submit" disabled={demoSubmitting} className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
            {demoSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Demo Review'}
          </button>
        </form>
      )}

      {/* Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Reviews', value: totalReviews, color: 'text-blue-500' },
          { label: 'Pending', value: pendingCount, color: 'text-yellow-500' },
          { label: 'Approved', value: approvedCount, color: 'text-emerald-500' },
          { label: 'Featured', value: featuredCount, color: 'text-yellow-400' },
          { label: 'Avg Rating', value: avgRating, color: 'text-primary', icon: <Star className="w-4 h-4 inline-block -mt-1 ml-1" /> }
        ].map((stat, idx) => (
          <div key={idx} className="bg-admin-card p-4 rounded-2xl border border-admin-border shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-admin-text-muted text-sm font-medium mb-1">{stat.label}</span>
            <span className={`text-2xl font-bold ${stat.color}`}>
              {stat.value} {stat.icon}
            </span>
          </div>
        ))}
      </div>

      {/* Search, Sort, and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-admin-card p-4 rounded-2xl border border-admin-border shadow-sm">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 lg:flex-1">
          {([
            { key: 'all', label: 'All Reviews', count: totalReviews },
            { key: 'pending', label: 'Pending', count: pendingCount },
            { key: 'approved', label: 'Approved', count: approvedCount },
            { key: 'rejected', label: 'Rejected', count: rejectedCount },
            { key: 'demo', label: 'Demo Reviews', count: demoCount },
            { key: 'featured', label: 'Featured', count: featuredCount },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-admin-bg text-admin-text-muted hover:bg-admin-border hover:text-admin-text'
              }`}
            >
              {tab.label} <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${filter === tab.key ? 'bg-white/20' : 'bg-admin-border'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 lg:w-[400px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
            <input 
              type="text" 
              placeholder="Search by Name, Location, Service..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 rounded-xl bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary appearance-none cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      {processedReviews.length === 0 ? (
        <div className="text-center py-16 bg-admin-card rounded-2xl border border-admin-border shadow-sm">
          <LayoutGrid className="w-12 h-12 mx-auto text-admin-text-muted mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-admin-text mb-1">No Reviews Found</h3>
          <p className="text-admin-text-muted">We couldn't find any reviews matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedReviews.map(review => (
            <div key={review.id} className="flex flex-col bg-admin-card rounded-2xl border border-admin-border shadow-sm hover:shadow-md transition-all overflow-hidden relative">
              
              {/* Card Edit Mode */}
              {editingId === review.id ? (
                <div className="p-5 flex flex-col h-full space-y-4">
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setEditForm({...editForm, rating: s})} className="focus:outline-none">
                        <Star className={`w-5 h-5 ${s <= editForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                  <input type="text" value={editForm.patient_name} onChange={e => setEditForm({...editForm, patient_name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary" placeholder="Patient Name" />
                  <input type="text" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary" placeholder="Location" />
                  <input type="text" value={editForm.service_received} onChange={e => setEditForm({...editForm, service_received: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary" placeholder="Service" />
                  <textarea rows={4} value={editForm.review_message} onChange={e => setEditForm({...editForm, review_message: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-admin-bg border border-admin-border text-admin-text text-sm outline-none focus:border-primary resize-none flex-1" placeholder="Review message" />
                  
                  <div className="flex gap-2 pt-2 border-t border-admin-border mt-auto">
                    <button onClick={() => saveEdit(review.id)} className="flex-1 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500/20 transition-colors text-sm font-bold">Save</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-admin-bg text-admin-text-muted rounded-xl hover:bg-admin-border transition-colors text-sm font-bold">Cancel</button>
                  </div>
                </div>
              ) : (
                /* Card View Mode */
                <div className="p-5 flex flex-col h-full">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
                    ))}
                  </div>

                  {/* Header info */}
                  <h3 className="font-bold text-admin-text text-lg leading-tight mb-1">{review.patient_name}</h3>
                  <p className="text-xs text-admin-text-muted font-medium mb-3">
                    {review.location} &bull; {review.service_received}
                  </p>
                  
                  <p className="text-xs text-admin-text-muted mb-4">
                    {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>

                  {/* Message */}
                  <p className="text-sm text-admin-text leading-relaxed flex-1 italic mb-6">
                    "{review.review_message}"
                  </p>

                  {/* Bottom Area: Badges & Actions */}
                  <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-admin-border/50">
                    
                    {/* Status Badge */}
                    <div className="flex flex-wrap gap-2 items-center">
                      {review.review_type === 'demo' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                          🔵 Demo Review
                        </span>
                      ) : (
                        review.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                            🟡 Pending Review
                          </span>
                        ) : review.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            🟢 Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                            🔴 Rejected
                          </span>
                        )
                      )}

                      {review.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-400/10 text-yellow-600 border border-yellow-400/20 cursor-help" title="Featured reviews are highlighted and displayed first on the website homepage.">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      
                      {/* --- PENDING --- */}
                      {review.review_type === 'real' && review.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(review.id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20 transition-colors text-xs font-bold">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => updateStatus(review.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}

                      {/* --- APPROVED --- */}
                      {review.review_type === 'real' && review.status === 'approved' && (
                        <>
                          <button onClick={() => updateStatus(review.id, 'pending')} className="flex items-center gap-1 px-3 py-1.5 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-500/20 transition-colors text-xs font-bold">
                            <RotateCcw className="w-3.5 h-3.5" /> Unapprove
                          </button>
                        </>
                      )}

                      {/* --- REJECTED --- */}
                      {review.review_type === 'real' && review.status === 'rejected' && (
                        <>
                          <button onClick={() => updateStatus(review.id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20 transition-colors text-xs font-bold">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                        </>
                      )}

                      {/* FEATURE / UNFEATURE (Available for Demo and Approved) */}
                      {(review.review_type === 'demo' || (review.review_type === 'real' && review.status === 'approved')) && (
                        <button 
                          onClick={() => toggleFeatured(review.id, review.is_featured)} 
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold ${
                            review.is_featured 
                              ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20' 
                              : 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" /> {review.is_featured ? 'Unfeature' : 'Feature'}
                        </button>
                      )}

                      {/* EDIT (Pending, Approved, Demo) */}
                      {(review.status !== 'rejected' || review.review_type === 'demo') && (
                        <button onClick={() => startEditing(review)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors text-xs font-bold">
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}

                      {/* DELETE (All types) */}
                      <button onClick={() => deleteReview(review.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-900/10 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-900/20 transition-colors text-xs font-bold ml-auto">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>

                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

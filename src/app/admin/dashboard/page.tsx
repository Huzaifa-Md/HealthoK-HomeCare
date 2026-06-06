'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Booking, Service, ContactInquiry, Testimonial } from '@/lib/types';
import toast from 'react-hot-toast';
import {
  Heart, LogOut, CalendarCheck, Package, MessageSquare, Star,
  BarChart3, Clock, CheckCircle, XCircle, IndianRupee, AlertTriangle,
  Trash2, Edit3, Save, X, Home, Palette, Plus
} from 'lucide-react';

type Tab = 'overview' | 'bookings' | 'services' | 'inquiries' | 'testimonials';
type Theme = 'theme-light' | 'theme-dark' | 'theme-tan';

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [theme, setTheme] = useState<Theme>('theme-light');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Services Edit
  const [editingService, setEditingService] = useState<string | null>(null);

  // Reviews CRUD
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ customer_name: '', rating: 5, review: '' });
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editReviewData, setEditReviewData] = useState({ customer_name: '', rating: 5, review: '' });

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
  };

  const fetchAll = useCallback(async () => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) { router.push('/admin'); return; }
    const [b, s, i, t] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('service_name'),
      supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
    ]);
    if (b.data) setBookings(b.data);
    if (s.data) setServices(s.data);
    if (i.data) setInquiries(i.data);
    if (t.data) setTestimonials(t.data);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ booking_status: status }).eq('id', id);
    if (error) toast.error('Failed to update');
    else { toast.success(`Booking ${status}`); fetchAll(); }
  };

  const deleteInquiry = async (id: string) => {
    const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Inquiry deleted'); fetchAll(); }
  };

  const addReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('testimonials').insert([newReview]);
    if (error) toast.error('Failed to add review');
    else {
      toast.success('Review added');
      setShowAddReview(false);
      setNewReview({ customer_name: '', rating: 5, review: '' });
      fetchAll();
    }
  };

  const updateReview = async (id: string) => {
    const { error } = await supabase.from('testimonials').update(editReviewData).eq('id', id);
    if (error) toast.error('Failed to update review');
    else {
      toast.success('Review updated');
      setEditingReview(null);
      fetchAll();
    }
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) toast.error('Failed to delete review');
    else { toast.success('Review deleted'); fetchAll(); }
  };

  const pendingCount = bookings.filter((b) => b.booking_status === 'pending').length;
  const acceptedCount = bookings.filter((b) => b.booking_status === 'accepted').length;
  const emergencyCount = bookings.filter((b) => b.emergency_status).length;

  const parseCompositeAddress = (raw: string) => {
    if (!raw) return { address: '', notes: '', prescription: '' };
    const parts = raw.split(' | ');
    const address = parts[0];
    let notes = '';
    let prescription = '';
    parts.forEach(part => {
      if (part.startsWith('[Notes: ')) notes = part.replace('[Notes: ', '').replace(']', '');
      else if (part.startsWith('[Prescription: ')) prescription = part.replace('[Prescription: ', '').replace(']', '');
    });
    return { address, notes, prescription };
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, count: pendingCount },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, count: inquiries.filter((i) => !i.is_read).length },
    { id: 'testimonials', label: 'Reviews', icon: Star },
  ];

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${theme} min-h-screen bg-admin-bg transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-admin-card border-b border-admin-border sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-admin-text hidden sm:block">Health oK Admin</span>
            </div>
            
            <div className="h-6 w-px bg-admin-border mx-2 hidden sm:block"></div>
            
            {/* Theme Selector */}
            <div className="flex bg-admin-bg p-1 rounded-lg border border-admin-border">
              <button onClick={() => changeTheme('theme-light')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${theme === 'theme-light' ? 'bg-white shadow-sm text-gray-900' : 'text-admin-text-muted hover:text-admin-text'}`}>Light</button>
              <button onClick={() => changeTheme('theme-dark')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${theme === 'theme-dark' ? 'bg-slate-700 shadow-sm text-white' : 'text-admin-text-muted hover:text-admin-text'}`}>Dark</button>
              <button onClick={() => changeTheme('theme-tan')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${theme === 'theme-tan' ? 'bg-[#d2b48c] shadow-sm text-white' : 'text-admin-text-muted hover:text-admin-text'}`}>Tan</button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-admin-text-muted hover:text-primary hover:bg-primary/5 transition-all">
              <Home className="w-4 h-4" /><span className="hidden sm:inline">Website</span>
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-admin-text-muted hover:text-danger hover:bg-danger/5 transition-all">
              <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-admin-card text-admin-text-muted hover:text-admin-text border border-admin-border'}`}>
              <t.icon className="w-4 h-4" />{t.label}
              {t.count ? <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${tab === t.id ? 'bg-white/20' : 'bg-danger/10 text-danger'}`}>{t.count}</span> : null}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'from-primary to-accent' },
                { label: 'Pending', value: pendingCount, icon: Clock, color: 'from-yellow-400 to-orange-500' },
                { label: 'Emergencies', value: emergencyCount, icon: AlertTriangle, color: 'from-danger to-red-600' },
              ].map((card, i) => (
                <div key={i} className="p-6 rounded-2xl bg-admin-card border border-admin-border hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-admin-text-muted text-sm">{card.label}</p>
                  <p className="text-2xl font-bold text-admin-text mt-1">{card.value}</p>
                </div>
              ))}
            </div>
            {/* Recent bookings preview */}
            <div className="bg-admin-card rounded-2xl border border-admin-border p-6">
              <h3 className="font-bold text-admin-text mb-4">Recent Bookings</h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-admin-bg border border-admin-border">
                    <div>
                      <p className="font-medium text-admin-text text-sm">{b.customer_name}</p>
                      <div className="flex flex-wrap gap-1 mt-1 mb-1">
                        {b.selected_service.split(', ').map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold whitespace-nowrap">{s}</span>
                        ))}
                      </div>
                      <p className="text-admin-text-muted text-xs">{b.preferred_date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.emergency_status && <AlertTriangle className="w-4 h-4 text-danger" />}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[b.booking_status]}`}>{b.booking_status}</span>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <p className="text-admin-text-muted text-sm py-4">No recent bookings.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="bg-admin-card rounded-2xl border border-admin-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-admin-bg border-b border-admin-border">
                  <tr>
                    {['Customer & Address', 'Contact', 'Service Details', 'Date & Time', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-admin-text-muted text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {bookings.map((b) => {
                    const { address, notes, prescription } = parseCompositeAddress(b.address);
                    return (
                      <tr key={b.id} className={`hover:bg-admin-bg transition-colors ${b.emergency_status ? 'bg-danger/5' : ''}`}>
                        <td className="px-4 py-3 align-top">
                          <p className="font-medium text-admin-text flex items-center gap-2">
                            {b.customer_name}
                            {b.emergency_status && <span className="px-1.5 py-0.5 rounded-md bg-danger/10 text-danger text-[10px] font-bold uppercase tracking-wider">Urgent</span>}
                          </p>
                          <p className="text-admin-text-muted text-xs mt-1 max-w-[250px] whitespace-normal break-words">{address}</p>
                        </td>
                        <td className="px-4 py-3 align-top text-admin-text-muted text-sm">{b.phone}</td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {b.selected_service.split(', ').map(s => (
                              <span key={s} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">{s}</span>
                            ))}
                          </div>
                          {notes && (
                            <p className="text-admin-text-muted text-xs mt-1 max-w-[250px] whitespace-normal break-words bg-admin-card p-1.5 rounded border border-admin-border">
                              <span className="font-semibold">Notes:</span> {notes}
                            </p>
                          )}
                          {prescription && (
                            <div className="mt-1 flex items-center gap-1 text-primary text-xs bg-primary/5 p-1 rounded inline-flex border border-primary/10">
                              <span>📄 {prescription}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top text-admin-text-muted text-sm">{b.preferred_date}<br /><span className="text-admin-text-muted text-xs">{b.preferred_time}</span></td>
                        <td className="px-4 py-3 align-top"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[b.booking_status]}`}>{b.booking_status}</span></td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex gap-1">
                            {b.booking_status === 'pending' && (
                              <>
                                <button onClick={() => updateBookingStatus(b.id, 'accepted')} className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors" title="Accept"><CheckCircle className="w-4 h-4" /></button>
                                <button onClick={() => updateBookingStatus(b.id, 'rejected')} className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                              </>
                            )}
                            {b.booking_status === 'accepted' && (
                              <button onClick={() => updateBookingStatus(b.id, 'completed')} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Complete"><CheckCircle className="w-4 h-4" /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {bookings.length === 0 && <p className="text-center text-admin-text-muted py-12">No bookings yet.</p>}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {tab === 'services' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.id} className="p-5 rounded-2xl bg-admin-card border border-admin-border hover:shadow-lg transition-all flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-admin-text mb-1">{s.service_name}</h4>
                  <p className="text-admin-text-muted text-xs">{s.category}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inquiries Tab */}
        {tab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-5 rounded-2xl bg-admin-card border border-admin-border hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-admin-text">{inq.name}</p>
                    <p className="text-admin-text-muted text-xs">{inq.phone} • {inq.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-admin-text-muted text-xs">{new Date(inq.created_at).toLocaleDateString()}</span>
                    <button onClick={() => deleteInquiry(inq.id)} className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="mt-3 text-admin-text-muted text-sm leading-relaxed">{inq.message}</p>
              </div>
            ))}
            {inquiries.length === 0 && <p className="text-center text-admin-text-muted py-12">No inquiries yet.</p>}
          </div>
        )}

        {/* Testimonials Tab */}
        {tab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowAddReview(!showAddReview)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                {showAddReview ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showAddReview ? 'Cancel' : 'Add Review'}
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
            {testimonials.length === 0 && !showAddReview && <p className="text-center text-admin-text-muted py-12">No reviews yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

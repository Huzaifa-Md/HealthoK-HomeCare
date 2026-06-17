'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/lib/types';
import toast from 'react-hot-toast';
import { Search, Filter, Trash2, CalendarCheck, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Failed to load callback requests');
    else setBookings(data || []);
    setLoading(false);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ booking_status: status }).eq('id', id);
    if (error) toast.error('Failed to update status');
    else { toast.success(`Request marked as ${status}`); fetchBookings(); }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) toast.error('Failed to delete request');
    else { toast.success('Request deleted'); fetchBookings(); }
  };

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

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
    accepted: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30',
    completed: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.phone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-admin-text">Callback Requests</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
            <input 
              type="text" 
              placeholder="Search name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-admin-card border border-admin-border text-sm text-admin-text outline-none focus:border-primary"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 rounded-xl bg-admin-card border border-admin-border text-sm text-admin-text outline-none focus:border-primary appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-admin-card rounded-2xl border border-admin-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-admin-bg border-b border-admin-border">
              <tr>
                {['Patient Info', 'Requirements / Service', 'Date Submitted', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-admin-text-muted text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {paginatedBookings.map((b) => {
                const { notes } = parseCompositeAddress(b.address);
                return (
                  <tr key={b.id} className={`hover:bg-admin-bg transition-colors ${b.emergency_status ? 'bg-danger/5' : ''}`}>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-admin-text">{b.customer_name}</p>
                      <p className="text-admin-text-muted text-xs mt-1 font-medium">{b.phone}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-block px-2 py-0.5 mb-2 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        {b.selected_service}
                      </span>
                      {notes ? (
                        <p className="text-admin-text-muted text-xs max-w-xs whitespace-pre-wrap">
                          {notes}
                        </p>
                      ) : (
                        <p className="text-admin-text-muted text-xs italic">No additional requirements.</p>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="text-admin-text text-sm">{new Date(b.created_at).toLocaleDateString()}</p>
                      <p className="text-admin-text-muted text-xs mt-0.5">{new Date(b.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor[b.booking_status]}`}>
                        {b.booking_status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex gap-2">
                        {b.booking_status === 'pending' && (
                          <>
                            <button onClick={() => updateBookingStatus(b.id, 'accepted')} className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors" title="Accept"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => updateBookingStatus(b.id, 'rejected')} className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                        {b.booking_status === 'accepted' && (
                          <button onClick={() => updateBookingStatus(b.id, 'completed')} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Complete"><CheckCircle className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => deleteBooking(b.id)} className="p-1.5 rounded-lg bg-admin-bg text-admin-text-muted hover:bg-danger/10 hover:text-danger transition-colors ml-auto border border-admin-border" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {paginatedBookings.length === 0 && (
            <div className="text-center py-12">
              <CalendarCheck className="w-12 h-12 text-admin-border mx-auto mb-3" />
              <p className="text-admin-text-muted font-medium">No requests found.</p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="bg-admin-bg px-4 py-3 border-t border-admin-border flex items-center justify-between">
            <span className="text-sm text-admin-text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length}
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1 rounded-lg border border-admin-border bg-admin-card text-admin-text text-sm disabled:opacity-50 hover:bg-admin-bg"
              >
                Prev
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1 rounded-lg border border-admin-border bg-admin-card text-admin-text text-sm disabled:opacity-50 hover:bg-admin-bg"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

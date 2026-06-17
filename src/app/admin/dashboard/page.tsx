'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Booking, Service } from '@/lib/types';
import {
  Heart, LogOut, CalendarCheck, Package,
  BarChart3, Clock, CheckCircle, Home, Menu, X, Settings
} from 'lucide-react';

// Import Tabs
import ServicesTab from '@/components/admin/ServicesTab';
import BookingsTab from '@/components/admin/BookingsTab';
import SettingsTab from '@/components/admin/SettingsTab';

type Tab = 'overview' | 'services' | 'requests' | 'settings';
type Theme = 'theme-light' | 'theme-dark';

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [theme, setTheme] = useState<Theme>('theme-light');
  const [mounted, setMounted] = useState(false);
  
  // Overview Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check auth
    const checkSession = async () => {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) { router.push('/admin'); return; }
    };
    checkSession();
    
    // Initial Theme load
    const loadTheme = () => {
      const savedTheme = localStorage.getItem('admin-theme') as Theme;
      if (savedTheme === 'theme-dark' || savedTheme === 'theme-light') {
        setTheme(savedTheme);
        if (savedTheme === 'theme-dark') {
          document.documentElement.classList.add('dark', 'theme-dark');
          document.documentElement.classList.remove('theme-light');
        } else {
          document.documentElement.classList.add('theme-light');
          document.documentElement.classList.remove('dark', 'theme-dark');
        }
      }
      setMounted(true);
    };
    loadTheme();

    // Listen to theme changes from SettingsTab
    const handleThemeChange = () => loadTheme();
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [router]);

  const fetchOverview = useCallback(async () => {
    if (tab !== 'overview') return;
    setLoading(true);
    const [b, s] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*'),
    ]);
    if (b.data) setBookings(b.data);
    if (s.data) setServices(s.data);
    setLoading(false);
  }, [tab]);

  useEffect(() => { 
    fetchOverview(); 
  }, [fetchOverview]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const pendingCount = bookings.filter((b) => b.booking_status === 'pending').length;
  const activeServices = services.filter((s) => s.is_active).length;

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Package, count: services.length || undefined },
    { id: 'requests', label: 'Callback Requests', icon: CalendarCheck, count: pendingCount || undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setIsSidebarOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className={`${theme} ${theme === 'theme-dark' ? 'dark' : ''} min-h-screen bg-admin-bg transition-colors duration-300 flex overflow-hidden`}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-[1000] w-72 bg-admin-card border-r border-admin-border transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-admin-border shrink-0">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="PrickCare" width={32} height={32} className="rounded-lg object-contain" />
            <span className="font-bold text-admin-text text-lg tracking-tight">PrickCare Admin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-admin-text-muted hover:bg-admin-bg rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {tabs.map((t) => (
            <button 
              key={t.id} 
              onClick={() => handleTabChange(t.id)} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-primary text-white shadow-md' : 'text-admin-text-muted hover:bg-admin-bg hover:text-admin-text'}`}
            >
              <div className="flex items-center gap-3">
                <t.icon className={`w-5 h-5 ${tab === t.id ? 'text-white' : 'text-admin-text-muted'}`} />
                {t.label}
              </div>
              {t.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab === t.id ? 'bg-white/20 text-white' : 'bg-admin-border text-admin-text-muted'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-admin-border space-y-2 shrink-0">
          <a href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-admin-text-muted hover:bg-admin-bg hover:text-admin-text transition-all">
            <Home className="w-5 h-5" /> Back to Website
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-admin-text-muted hover:bg-danger/10 hover:text-danger transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-admin-bg relative z-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-admin-card border-b border-admin-border flex items-center justify-between px-4 shrink-0 relative z-[998]">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-admin-text-muted hover:text-admin-text hover:bg-admin-bg rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-admin-text text-lg">PrickCare Admin</span>
          </div>
          <Image src="/logo.jpg" alt="PrickCare" width={32} height={32} className="rounded-lg object-contain" />
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
          
          {tab === 'overview' && (
            <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-admin-text mb-1">Dashboard</h1>
                <p className="text-admin-text-muted text-sm">Welcome back. Here&apos;s an overview of your platform.</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Services', value: services.length, icon: Package, color: 'from-primary to-accent' },
                      { label: 'Active Services', value: activeServices, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
                      { label: 'Total Requests', value: bookings.length, icon: CalendarCheck, color: 'from-purple-500 to-indigo-600' },
                      { label: 'Pending Requests', value: pendingCount, icon: Clock, color: 'from-yellow-400 to-orange-500' },
                    ].map((card, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-admin-card border border-admin-border shadow-sm hover:shadow-md transition-all group cursor-default">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-admin-text">{card.value}</p>
                        <p className="text-admin-text-muted text-sm font-medium uppercase tracking-wider mt-1">{card.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-admin-card rounded-2xl border border-admin-border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-admin-text">Recent Callback Requests</h3>
                      <button onClick={() => setTab('requests')} className="text-sm font-semibold text-primary hover:text-accent transition-colors">View All &rarr;</button>
                    </div>
                    
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((b) => (
                        <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-admin-bg border border-admin-border gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-admin-text text-sm">{b.customer_name}</p>
                              {b.emergency_status && <span className="px-1.5 py-0.5 rounded bg-danger/10 text-danger text-[10px] font-bold uppercase tracking-wider border border-danger/20">Urgent</span>}
                            </div>
                            <p className="text-admin-text-muted text-xs">{b.phone} • {b.selected_service}</p>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            <span className="text-admin-text-muted text-xs">{new Date(b.created_at).toLocaleDateString()}</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.booking_status === 'pending' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' :
                              b.booking_status === 'accepted' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' :
                              b.booking_status === 'completed' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
                              'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                            }`}>{b.booking_status}</span>
                          </div>
                        </div>
                      ))}
                      {bookings.length === 0 && (
                        <div className="text-center py-8">
                          <CalendarCheck className="w-8 h-8 text-admin-border mx-auto mb-2" />
                          <p className="text-admin-text-muted text-sm">No recent requests.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'services' && <div className="max-w-6xl mx-auto animate-fade-in"><ServicesTab /></div>}
          {tab === 'requests' && <div className="max-w-6xl mx-auto animate-fade-in"><BookingsTab /></div>}
          {tab === 'settings' && <div className="max-w-6xl mx-auto animate-fade-in"><SettingsTab /></div>}

        </div>
      </main>
    </div>
  );
}

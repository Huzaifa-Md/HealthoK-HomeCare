'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Heart, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error('Invalid credentials. Access denied.');
    } else {
      toast.success('Welcome, Admin!');
      router.push('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center mb-8 animate-fade-in-up">
          <div className="w-32 h-auto mb-4 bg-white rounded-xl shadow-lg shadow-black/5 flex items-center justify-center p-2">
            <img src="/logo.jpg" alt="Patient Care Home Services" className="w-full h-auto object-contain" />
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-white mb-2 text-center">
            Patient Care
            <span className="font-sans text-xl block mt-1 text-white/80">Home Services Admin</span>
          </h1>
        </div>
        <form onSubmit={handleLogin} className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" placeholder="admin@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" />Sign In</>}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}

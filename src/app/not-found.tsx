'use client';

import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-secondary/10 to-secondary/5 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
          <AlertCircle className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4 animate-fade-in-up stagger-1">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 animate-fade-in-up stagger-2">Page Not Found</h2>
        <p className="text-gray-600 mb-10 leading-relaxed animate-fade-in-up stagger-3">
          We're sorry, the page you're looking for doesn't exist or has been moved. 
          Let's get you back to our professional home care services.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up stagger-4"
        >
          <Home className="w-5 h-5" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}

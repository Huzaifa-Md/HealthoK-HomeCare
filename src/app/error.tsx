'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-danger/10 to-danger/5 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-primary/10 to-primary/5 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
          <ShieldAlert className="w-12 h-12 text-danger" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up stagger-1">Something went wrong!</h1>
        <p className="text-gray-600 mb-10 leading-relaxed animate-fade-in-up stagger-2">
          We encountered an unexpected error while processing your request. Please try again or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
          <button 
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-danger hover:bg-red-600 shadow-lg shadow-danger/30 transition-all duration-300 hover:-translate-y-1"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
          
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all duration-300 hover:-translate-y-1"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

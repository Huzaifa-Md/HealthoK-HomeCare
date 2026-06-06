'use client';

import { PhoneCall } from 'lucide-react';

interface FloatingCallbackProps {
  onClick: () => void;
}

export default function FloatingCallback({ onClick }: FloatingCallbackProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 animate-pulse-glow group"
      aria-label="Request Callback"
    >
      <PhoneCall className="w-5 h-5 group-hover:animate-bounce" />
      <span className="hidden sm:inline text-sm">Request Callback</span>
    </button>
  );
}

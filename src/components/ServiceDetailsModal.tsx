'use client';

import { useEffect, useRef } from 'react';
import { X, PhoneCall } from 'lucide-react';

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    description: string;
    icon: React.ElementType;
  } | null;
  onRequestCallback: (serviceTitle: string) => void;
}

export default function ServiceDetailsModal({
  isOpen,
  onClose,
  service,
  onRequestCallback,
}: ServiceDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal / Bottom Sheet */}
      <div
        ref={modalRef}
        className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up sm:animate-fade-in-up"
      >
        {/* Drag Handle (Mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <service.icon className="w-6 h-6 text-primary" />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            {service.title}
          </h2>
          <p className="text-text-secondary text-base leading-relaxed mb-8">
            {service.description}
          </p>

          {/* Action Button */}
          <button
            onClick={() => {
              onClose();
              onRequestCallback(service.title);
            }}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-5 h-5" />
            Request Callback
          </button>
        </div>
      </div>
    </div>
  );
}

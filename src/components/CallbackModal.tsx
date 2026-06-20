'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import {
  X,
  User,
  Phone,
  MapPin,
  Stethoscope,
  CalendarDays,
  Clock,
  FileText,
  Upload,
  AlertTriangle,
  Send,
  Loader2,
} from 'lucide-react';



interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export default function CallbackModal({
  isOpen,
  onClose,
  preselectedService,
}: CallbackModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!form.notes.trim()) {
      toast.error('Please describe the required service.');
      return;
    }
    if (form.notes.length < 10) {
      toast.error('Notes must be at least 10 characters.');
      return;
    }

    setSubmitting(true);

    try {
      // Mapping the simplified form fields back to the existing DB schema requirements
      // using valid dummy defaults for removed fields to satisfy NOT NULL constraints.
      const bookingData: any = {
        customer_name: form.name,
        phone: form.phone,
        address: 'Not provided',
        selected_service: 'General Callback',
        preferred_date: new Date().toISOString().split('T')[0], // valid date
        preferred_time: '00:00', // valid time
        emergency_status: false,
        booking_status: 'pending' as const,
      };

      const { error } = await supabase.from('bookings').insert([bookingData]);
      if (error) {
        console.error('Supabase insert error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Show meaningful error messages
        if (error.code === '23502') {
          toast.error('Database schema error: Missing required fields.');
        } else if (error.code === '42P01') {
          toast.error('Database configuration error: Table not found.');
        } else {
          toast.error(`Failed to submit request: ${error.message}`);
        }
        setSubmitting(false);
        return;
      }

      // Send email notification
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            notes: form.notes,
          }),
        });
        
        if (!response.ok) {
          console.error('Email API failed');
          toast.success('Your request was saved, but our email system is currently delayed. We will still contact you shortly.');
        } else {
          toast.success('Thank you. Your callback request has been received. Our team will contact you shortly.');
        }
      } catch (emailErr) {
        console.error('Network error sending email:', emailErr);
        toast.success('Your request was saved successfully, though email notification was delayed. We will contact you shortly.');
      }

      // Reset form
      setForm({
        name: '',
        phone: '',
        email: '',
        notes: '',
      });
      onClose();
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong. Database unavailable or permission denied.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Request Callback
              </h2>
              <p className="text-sm text-text-secondary mt-0.5">
                Fill in your details and we&apos;ll get back to you shortly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Patient Name */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
              <User className="w-4 h-4 text-primary" />
              Patient Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              placeholder="Enter patient name"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
              <Phone className="w-4 h-4 text-primary" />
              Mobile Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              placeholder="10-digit mobile number"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
              <User className="w-4 h-4 text-primary" />
              Email Address <span className="text-text-muted font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              placeholder="For confirmation email"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
              <FileText className="w-4 h-4 text-primary" />
              Notes / Requirements <span className="text-danger">*</span>
            </label>
            <textarea
              required
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
              placeholder="Any special instructions, requirements, or medical conditions..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

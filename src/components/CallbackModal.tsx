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

const serviceCategories = [
  {
    name: 'Lab Tests',
    services: [
      'Blood Test', 'CBC Test', 'HbA1c Test', 'Lipid Profile', 
      'Kidney Function Test', 'Liver Function Test', 'Vitamin D Test', 
      'Uric Acid Test', 'Urine Routine Test'
    ]
  },
  {
    name: 'Nursing Procedures',
    services: [
      'IM Injection', 'IV Injection', 'Cannulation', 'IV Drip Administration', 
      'Wound Dressing', 'Post Surgery Dressing', 'Enema Procedure', 
      'Colostomy/Ostomy Care', 'Nebulization', 'BP Monitoring', 'Sugar Monitoring'
    ]
  },
  {
    name: 'Injection & Vaccination',
    services: [
      'IM Injection', 'IV Injection', 'Insulin Injection', 
      'Vitamin Injection', 'Adult Vaccination', 'Senior Citizen Vaccination'
    ]
  }
];

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
    address: '',
    services: preselectedService ? [preselectedService] : [] as string[],
    date: '',
    time: '',
    notes: '',
    urgent: false,
  });
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preselectedService) {
      setForm((prev) => ({ 
        ...prev, 
        services: prev.services.includes(preselectedService) 
          ? prev.services 
          : [...prev.services, preselectedService] 
      }));
    }
  }, [preselectedService]);

  const toggleService = (service: string) => {
    setForm(prev => {
      if (prev.services.includes(service)) {
        return { ...prev, services: prev.services.filter(s => s !== service) };
      } else {
        return { ...prev, services: [...prev.services, service] };
      }
    });
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Max size is 5MB.');
        return;
      }
      setPrescriptionFile(file);
      const reader = new FileReader();
      reader.onload = () => setPrescriptionPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || form.services.length === 0) {
      toast.error('Please fill in all required fields and select at least one service.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);

    try {
      // Build the address field with embedded metadata
      let compositeAddress = form.address;
      if (form.notes) {
        compositeAddress += ` | [Notes: ${form.notes}]`;
      }
      if (prescriptionPreview) {
        // Truncate base64 for storage (first 500 chars as reference)
        const prescRef = prescriptionFile?.name || 'uploaded';
        compositeAddress += ` | [Prescription: ${prescRef}]`;
      }

      const bookingData = {
        customer_name: form.name,
        phone: form.phone,
        address: compositeAddress,
        selected_service: form.services.join(', '),
        preferred_date: form.date || 'Not specified',
        preferred_time: form.time || 'Not specified',
        emergency_status: form.urgent,
        booking_status: 'pending' as const,
      };

      const { error } = await supabase.from('bookings').insert([bookingData]);
      if (error) {
        console.error('Supabase insert error:', error);
        toast.error('Failed to submit request. Please try again.');
        setSubmitting(false);
        return;
      }

      // Send email notification (best-effort)
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            address: form.address,
            service: form.services.join(', '),
            date: form.date || 'Not specified',
            time: form.time || 'Not specified',
            notes: form.notes || 'None',
            urgent: form.urgent,
          }),
        });
      } catch {
        // Best-effort email
      }

      // Generate WhatsApp message
      const whatsappMsg = encodeURIComponent(
        `*New Callback Request*\n\n` +
          `*Name:* ${form.name}\n` +
          `*Phone:* ${form.phone}\n` +
          `*Address:* ${form.address}\n` +
          `*Services:* ${form.services.join(', ')}\n` +
          `*Date:* ${form.date || 'Not specified'}\n` +
          `*Time:* ${form.time || 'Not specified'}\n` +
          `*Notes:* ${form.notes || 'None'}\n` +
          `*Urgent:* ${form.urgent ? 'YES ⚠️' : 'No'}`
      );

      toast.success('Request submitted successfully!');

      // Open WhatsApp
      window.open(
        `https://wa.me/919870270197?text=${whatsappMsg}`,
        '_blank'
      );

      // Reset form
      setForm({
        name: '',
        phone: '',
        address: '',
        services: [],
        date: '',
        time: '',
        notes: '',
        urgent: false,
      });
      setPrescriptionFile(null);
      setPrescriptionPreview('');
      onClose();
    } catch {
      toast.error('Something went wrong. Please try again.');
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

          {/* Address */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              Address <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              placeholder="Home address for service visit"
            />
          </div>

          {/* Required Services */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
              <Stethoscope className="w-4 h-4 text-primary" />
              Required Services <span className="text-danger">*</span>
            </label>
            <div className="w-full max-h-64 overflow-y-auto px-4 py-3 rounded-xl border border-border bg-gray-50 space-y-4 shadow-inner">
              {serviceCategories.map(cat => (
                <div key={cat.name}>
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{cat.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.services.map(s => (
                      <label key={`${cat.name}-${s}`} className="flex items-start gap-2.5 cursor-pointer group p-1 hover:bg-primary/5 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={form.services.includes(s)}
                          onChange={() => toggleService(s)}
                          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary shrink-0"
                        />
                        <span className="text-sm text-text-primary group-hover:text-primary transition-colors leading-tight">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
                <CalendarDays className="w-4 h-4 text-primary" />
                Preferred Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
                <Clock className="w-4 h-4 text-primary" />
                Preferred Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Upload Prescription */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
              <Upload className="w-4 h-4 text-primary" />
              Upload Prescription{' '}
              <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-border bg-gray-50 text-text-secondary text-sm cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
            >
              {prescriptionFile ? (
                <span className="text-primary font-medium truncate">
                  📎 {prescriptionFile.name}
                </span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Click to upload (max 5MB)
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-1.5">
              <FileText className="w-4 h-4 text-primary" />
              Additional Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
              placeholder="Any special instructions or medical conditions..."
            />
          </div>

          {/* Urgent Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-warning/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={form.urgent}
              onChange={(e) =>
                setForm({ ...form, urgent: e.target.checked })
              }
              className="w-4 h-4 rounded border-border text-danger focus:ring-danger/20 accent-danger"
            />
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <span className="text-sm font-medium text-text-primary">
                Urgent Request
              </span>
            </div>
          </label>

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

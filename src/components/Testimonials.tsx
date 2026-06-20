'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, Plus, X, Loader2, Award, MapPin, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Review } from '@/lib/types';
import toast from 'react-hot-toast';

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patient_name: '',
    location: '',
    service_received: '',
    rating: 5,
    review_message: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .or('status.eq.approved,review_type.eq.demo')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating < 1 || formData.rating > 5) {
      toast.error('Please provide a valid rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit');

      toast.success('Thank you! Your review has been submitted and is pending approval.');
      setShowModal(false);
      setFormData({ patient_name: '', location: '', service_received: '', rating: 5, review_message: '' });
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="section-padding bg-bg-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      
      <div className="content-container relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-cormorant tracking-tight">
              What Our Patients Say
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto lg:mx-0 rounded-full" />
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-white rounded-xl font-semibold transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Leave a Review
          </button>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12 animate-fade-in-up">
          {[
            { value: '4.9', label: 'Average Rating', icon: '⭐' },
            { value: '1000+', label: 'Patients Served', icon: '👨‍⚕️' },
            { value: '250+', label: 'Happy Families', icon: '👨‍👩‍👧‍👦' },
            { value: '98%', label: 'Satisfaction Rate', icon: '✅' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <p className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className={`bg-white/5 backdrop-blur-md border rounded-2xl flex flex-col hover:bg-white/10 transition-all transform hover:-translate-y-1 ${
                  review.is_featured 
                    ? 'border-primary/50 shadow-lg shadow-primary/10 p-4 sm:p-6 lg:p-8' 
                    : 'border-white/10 p-4 sm:p-5 lg:p-6'
                }`}
              >
                {review.is_featured && (
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <Award className="w-4 h-4" /> Featured Review
                  </div>
                )}

                {/* Stars + Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 sm:w-5 sm:h-5 ${j < review.rating ? 'fill-current' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30" />
                </div>
                
                {/* Review Text */}
                <p className="text-white/90 leading-relaxed text-sm sm:text-base italic mb-6 flex-1">
                  &ldquo;{review.review_message}&rdquo;
                </p>
                
                {/* Patient Info */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-lg shrink-0">
                    {review.patient_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">
                      {review.patient_name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{review.location}</span>
                    </div>
                  </div>
                </div>

                {/* Service + Verified Badge */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-primary/80 font-medium truncate">{review.service_received}</span>
                  {review.review_type === 'real' && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider shrink-0">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
            <Star className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
            <p className="text-white/60">Be the first to share your experience with us!</p>
          </div>
        )}
      </div>

      {/* Leave a Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)} />
          <div className="bg-[#1a2332] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold font-cormorant text-white">Leave a Review</h3>
                <button onClick={() => setShowModal(false)} disabled={submitting} className="p-2 text-white/60 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Your Location *</label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. Raj Nagar Extension"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Service Received *</label>
                  <input
                    required
                    type="text"
                    value={formData.service_received}
                    onChange={(e) => setFormData({...formData, service_received: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. Nursing Care, Lab Test"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Your Experience *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.review_message}
                    onChange={(e) => setFormData({...formData, review_message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your experience (min 10 characters)..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

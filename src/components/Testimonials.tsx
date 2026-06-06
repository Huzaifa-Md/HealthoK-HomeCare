'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/lib/types';
import { Star, Quote, MessageSquareHeart } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (data) setTestimonials(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary-dark text-sm font-semibold mb-4">
            <MessageSquareHeart className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            What Our <span className="gradient-text">Patients Say</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Real experiences from real patients who trust us with their
            healthcare needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div>
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-full md:w-auto snap-center p-6 rounded-2xl bg-white border border-border animate-pulse"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="w-5 h-5 bg-gray-200 rounded" />
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6" />
                  <div className="h-4 bg-gray-200 rounded mb-6 w-4/6" />
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div 
              onScroll={handleScroll}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className="group relative shrink-0 w-full md:w-auto snap-center p-6 rounded-2xl bg-white border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 card-hover"
                >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-5 h-5 ${
                        j < t.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Review */}
                <p className="text-text-secondary leading-relaxed mb-6 text-sm">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {t.customer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">
                      {t.customer_name}
                    </p>
                    <p className="text-text-muted text-xs">Verified Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
            
            {/* Pagination Dots (Mobile Only) */}
            <div className="flex justify-center gap-2 mt-2 md:hidden">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

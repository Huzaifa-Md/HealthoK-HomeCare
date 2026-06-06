'use client';

import Image from 'next/image';
import {
  ShieldCheck,
  Clock,
  Siren,
  PhoneCall,
  Activity,
  HeartPulse,
} from 'lucide-react';

const highlights = [
  { icon: ShieldCheck, text: 'Certified Professionals' },
  { icon: Clock, text: 'Fast Home Visits' },
  { icon: HeartPulse, text: 'Quality Healthcare' },
  { icon: Siren, text: 'Emergency Support' },
];

interface HeroProps {
  onRequestCallback: () => void;
}

export default function Hero({ onRequestCallback }: HeroProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[280px] lg:min-h-[70vh] flex flex-col justify-center overflow-hidden bg-white pt-20 pb-8 lg:pt-32 lg:pb-16"
    >
      {/* Background Image and Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Professional home healthcare nurse"
          fill
          priority
          className="object-cover object-[center_top]"
        />
        {/* White-to-transparent gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent sm:via-white/90 sm:to-white/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white border border-primary/10 text-primary font-medium text-xs lg:text-sm mb-4 lg:mb-8 shadow-sm animate-fade-in-up">
            <Activity className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            Trusted Home Healthcare Provider
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-4 lg:mb-6 animate-fade-in-up stagger-1">
            Health oK
            <br />
            <span className="text-primary">Home Care</span>
            <br />
            Services
          </h1>

          {/* Subtitle */}
          <p className="text-base lg:text-xl text-gray-600 max-w-xl mb-6 lg:mb-10 animate-fade-in-up stagger-2 leading-relaxed">
            Professional healthcare services at your doorstep. Certified nurses
            and medical professionals available for home visits across
            Ghaziabad.
          </p>

          {/* CTA Button */}
          <div className="flex flex-wrap gap-4 mb-8 lg:mb-14 animate-fade-in-up stagger-3">
            <button
              onClick={onRequestCallback}
              className="px-8 py-4 rounded-2xl font-semibold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              Request Callback
            </button>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-4 animate-fade-in-up stagger-4">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                </div>
                <span className="text-xs lg:text-sm text-gray-700 font-medium leading-tight">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

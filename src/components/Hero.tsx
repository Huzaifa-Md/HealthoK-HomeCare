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
            Professional Expert At Home services at your doorstep. Certified nurses
            and medical professionals available for home visits across
            Ghaziabad.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 lg:mb-14 animate-fade-in-up stagger-3">
            <button
              onClick={onRequestCallback}
              className="px-8 py-4 rounded-2xl font-semibold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              Request Callback
            </button>
            <a
              href="https://wa.me/919870270197"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
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

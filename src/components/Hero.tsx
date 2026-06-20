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
      className="relative min-h-[320px] lg:min-h-[75vh] flex flex-col justify-center overflow-hidden bg-bg-dark pt-24 pb-16 lg:pt-32 lg:pb-20"
    >
      {/* Background Image and Strong Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Professional home healthcare"
          fill
          priority
          className="object-cover object-[center_top] opacity-40 mix-blend-overlay"
        />
        {/* Stronger medical blue gradient for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/95 to-[#0f172a]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 content-container w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-xs lg:text-sm mb-4 lg:mb-6 shadow-sm animate-fade-in-up">
            <Activity className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-secondary-light" />
            Trusted Home Healthcare Provider
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 lg:mb-6 animate-fade-in-up stagger-1 tracking-tight">
            <span className="font-cormorant block font-bold">Patient Care</span>
            <span className="font-sans block text-3xl sm:text-4xl lg:text-5xl mt-2 text-white/90 uppercase">Home Services</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base lg:text-xl text-white/80 max-w-xl mb-8 animate-fade-in-up stagger-2 leading-relaxed">
            Certified nurses and medical professionals available for home visits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-10 lg:mb-14 animate-fade-in-up stagger-3">
            <button
              onClick={onRequestCallback}
              className="px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 min-h-[50px] border border-white/10"
            >
              <PhoneCall className="w-5 h-5" />
              Request Callback
            </button>
            <a
              href="https://wa.me/919870270197"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 min-h-[50px] border border-white/10"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 animate-fade-in-up stagger-4">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0 shadow-lg">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-white font-semibold leading-tight">
                1000+<br/><span className="text-white/70 text-xs font-medium">Patients Served</span>
              </span>
            </div>
            {highlights.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-xs text-white/80 font-medium leading-tight">
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

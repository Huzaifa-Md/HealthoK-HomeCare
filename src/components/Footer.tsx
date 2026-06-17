'use client';

import { PhoneCall, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  onRequestCallback: () => void;
}

export default function Footer({ onRequestCallback }: FooterProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-bg-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />
      </div>
      <div className="content-container section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-[12px] mb-6 group w-max max-w-full"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Image
                src="/logo.jpg"
                alt="PrickCare Logo"
                width={50}
                height={50}
                className="w-[50px] h-[50px] block group-hover:scale-110 transition-transform object-contain shrink-0"
              />
              <span className="text-xl font-bold text-white leading-tight tracking-tight whitespace-nowrap">
                PrickCare<span className="text-primary">@</span><span className="text-sm font-medium opacity-80">HomeCare</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              <span className="text-primary font-semibold">Professional Experts At Home</span> services at your doorstep. Certified professionals, fast home visits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-white/90">Quick Links</h4>
            <ul className="space-y-3">
              {['home', 'services', 'about', 'contact'].map((id) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="text-white/50 hover:text-primary text-sm transition-colors capitalize">{id}</button>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-white/50 hover:text-primary text-sm transition-colors">Admin Area</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6 text-white/90">Top Services</h4>
            <ul className="space-y-3">
              {['Blood Test at Home', 'IV Injection & Drip', 'Wound Dressing', 'Adult Vaccination'].map((s) => (
                <li key={s}>
                  <button onClick={() => scrollTo('services')} className="text-white/50 hover:text-primary text-sm transition-colors text-left">{s}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-white/90">Contact & Support</h4>
            <div className="space-y-4">
              <p className="text-white/50 text-sm mb-4">
                Need immediate assistance or want to book a service?
              </p>
              
              <button
                onClick={onRequestCallback}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-primary border border-white/20 hover:border-primary transition-all duration-300"
              >
                <PhoneCall className="w-4 h-4" />
                Request Callback
              </button>
              
              <div className="flex items-start gap-3 text-white/50 text-sm mt-6">
                <MapPin className="w-5 h-5 shrink-0 text-primary" />
                <span>Serving all major areas in Ghaziabad, Uttar Pradesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} PrickCare. All rights reserved.</p>
          <p className="text-white/30 text-xs">Healthcare at your doorstep</p>
        </div>
      </div>
    </footer>
  );
}

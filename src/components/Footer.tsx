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
            <Link href="/" className="flex items-center gap-3 group shrink-0 mb-6" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Image
                src="/logo.jpg"
                alt="Patient Care Home Services Logo"
                width={50}
                height={50}
                className="w-12 h-12 object-contain bg-white rounded-lg p-1 group-hover:scale-105 transition-transform"
              />
              <span className="font-cormorant font-bold text-2xl text-white tracking-tight">
                Patient Care
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              <span className="text-primary font-semibold">Care At Home</span> services at your doorstep. Certified professionals, fast home visits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-white/90">Quick Links</h4>
            <ul className="space-y-3">
              {['home', 'services', 'areas', 'testimonials', 'about', 'contact'].map((id) => (
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
            <h4 className="font-semibold mb-6 text-white/90">Our Services</h4>
            <ul className="space-y-3">
              {[
                'Nursing Procedures',
                'Injection Services',
                'IV Drip & Fluids',
                'Wound Care',
                'Elderly Care',
              ].map((service) => (
                <li key={service}>
                  <button onClick={() => {
                    scrollTo('services');
                    setTimeout(onRequestCallback, 500);
                  }} className="text-white/50 hover:text-primary text-sm transition-colors">
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-white/90">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/90 text-sm font-medium">+91 9870270197</p>
                  <p className="text-white/50 text-xs mt-1">24/7 Available</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Ghaziabad & East Delhi</p>
                  <p className="text-white/50 text-xs mt-1">Providing services at home</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Patient Care Home Services. All rights reserved.</p>
          <p className="text-white/30 text-xs">Healthcare at your doorstep</p>
        </div>
      </div>
    </footer>
  );
}

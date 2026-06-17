'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  PhoneCall,
} from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Areas', href: '#areas' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  onRequestCallback: () => void;
}

export default function Navbar({ onRequestCallback }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled
          ? 'shadow-lg shadow-primary/5'
          : 'shadow-sm'
      }`}
    >
      <div className="content-container">
        <div className="flex items-center justify-between h-14 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Image
              src="/logo.jpg"
              alt="PrickCare Logo"
              width={60}
              height={60}
              className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] lg:w-[56px] lg:h-[56px] object-contain group-hover:scale-110 transition-transform shrink-0"
              priority
            />
            <span className="text-sm sm:text-base lg:text-lg font-bold text-text-primary leading-tight tracking-tight whitespace-nowrap">
              PrickCare<span className="text-primary">@</span>HomeCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-primary bg-primary/10'
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onRequestCallback}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              Request Callback
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl transition-colors text-text-primary hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-border px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === link.href.replace('#', '')
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="flex gap-3 pt-3 border-t border-border">
            <button
              onClick={() => {
                setIsOpen(false);
                onRequestCallback();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent"
            >
              <PhoneCall className="w-4 h-4" />
              Request Callback
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

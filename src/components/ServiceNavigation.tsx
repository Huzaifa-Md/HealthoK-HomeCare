'use client';

import { TestTube, Bandage, Syringe, HeartPulse } from 'lucide-react';

const serviceCategories = [
  {
    id: 'nursing-procedures',
    title: 'Nursing Procedures',
    icon: Bandage,
    description: 'Professional nursing care at home',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'injection-services',
    title: 'Injection Services',
    icon: Syringe,
    description: 'Specialized IV and injection therapies',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'vaccination',
    title: 'Vaccination',
    icon: Syringe,
    description: 'Safe vaccinations at home',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'health-checkup',
    title: 'Health Check-up Packages',
    icon: HeartPulse,
    description: 'Comprehensive health screening packages',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'lab-tests',
    title: 'Lab Tests',
    icon: TestTube,
    description: 'Home sample collection & diagnostics',
    color: 'from-blue-500 to-cyan-500',
  },
];

export default function ServiceNavigation() {
  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 pt-8 pb-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 md:mb-6">
            Professional Expert{' '}
            <span className="gradient-text">At Home</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base lg:text-lg">
            Select a category to explore available home healthcare services.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6">
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="group block text-center md:text-left p-3 sm:p-5 lg:p-6 rounded-2xl bg-white border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 w-full h-full"
            >
              <div
                className={`mx-auto md:mx-0 w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform shadow-md`}
              >
                <cat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-[13px] sm:text-[15px] lg:text-lg font-bold text-text-primary mb-1">
                  {cat.title}
                </h3>
                <p className="text-text-secondary text-[11px] sm:text-xs lg:text-sm leading-tight sm:leading-normal">{cat.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

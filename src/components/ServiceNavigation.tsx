'use client';

import { TestTube, Bandage, Syringe } from 'lucide-react';

const serviceCategories = [
  {
    id: 'lab-tests',
    title: 'Lab Tests',
    icon: TestTube,
    description: 'Home sample collection & diagnostics',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'nursing-procedures',
    title: 'Nursing Procedures',
    icon: Bandage,
    description: 'Professional nursing care at home',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'injection-vaccination',
    title: 'Injection & Vaccination',
    icon: Syringe,
    description: 'Safe injections & vaccinations at home',
    color: 'from-violet-500 to-purple-500',
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
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 md:mb-3">
            Our Healthcare Services
          </h2>
          <p className="text-text-secondary text-sm sm:text-base">
            Select a category to explore available home healthcare services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="group flex md:block items-center md:items-start gap-4 md:gap-0 text-left p-4 sm:p-5 lg:p-6 rounded-2xl bg-white border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 min-h-[90px] md:min-h-[100px] w-full"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center md:mb-4 group-hover:scale-110 transition-transform shadow-md`}
              >
                <cat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-text-primary mb-0.5 sm:mb-1">
                  {cat.title}
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm leading-tight sm:leading-normal">{cat.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

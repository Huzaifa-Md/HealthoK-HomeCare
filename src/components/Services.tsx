'use client';

import { useState } from 'react';
import ServiceDetailsModal from './ServiceDetailsModal';import {
  TestTube,
  Bandage,
  Syringe,
  Droplets,
  Activity,
  Wind,
  HeartPulse,
  Pill,
  FlaskConical,
  Microscope,
  Scissors,
  Package,
  Thermometer,
  ShieldPlus,
  Baby,
  Users,
} from 'lucide-react';



// ============================
// Lab Test Items
// ============================

const labTests = [
  {
    title: 'Blood Test',
    description:
      'Convenient home sample collection performed by trained healthcare professionals for timely diagnosis and monitoring.',
    icon: Droplets,
  },
  {
    title: 'CBC Test',
    description:
      'Complete blood count analysis to evaluate your overall health and detect a wide range of disorders including infections and anemia.',
    icon: FlaskConical,
  },
  {
    title: 'HbA1c Test',
    description:
      'Glycated hemoglobin testing to measure average blood sugar levels over the past two to three months for effective diabetes management.',
    icon: Activity,
  },
  {
    title: 'Lipid Profile',
    description:
      'Comprehensive cholesterol and triglyceride panel to assess cardiovascular health and guide dietary or treatment decisions.',
    icon: HeartPulse,
  },
  {
    title: 'Kidney Function Test',
    description:
      'Evaluate kidney performance through creatinine, urea, and electrolyte analysis to detect early signs of renal impairment.',
    icon: Microscope,
  },
  {
    title: 'Liver Function Test',
    description:
      'Measure enzyme and protein levels to assess liver health, detect inflammation, and monitor the effects of medications.',
    icon: FlaskConical,
  },
  {
    title: 'Vitamin D Test',
    description:
      'Determine your vitamin D levels to identify deficiencies that can impact bone health, immunity, and overall well-being.',
    icon: Thermometer,
  },
  {
    title: 'Uric Acid Test',
    description:
      'Monitor uric acid concentration in the blood to assess risk of gout, kidney stones, and related metabolic conditions.',
    icon: TestTube,
  },
  {
    title: 'Urine Routine Test',
    description:
      'Standard urinalysis to screen for urinary tract infections, kidney disease, diabetes, and other systemic conditions.',
    icon: FlaskConical,
  },
];

// ============================
// Nursing Procedure Items
// ============================

const nursingProcedures = [
  {
    title: 'IM Injection',
    description:
      'Intramuscular injection administration by certified nurses ensuring proper technique, sterile handling, and patient comfort at home.',
    icon: Syringe,
  },
  {
    title: 'IV Injection',
    description:
      'Intravenous medication delivery with precision and safety, performed by experienced healthcare professionals at your residence.',
    icon: Syringe,
  },
  {
    title: 'Cannulation',
    description:
      'Expert peripheral venous cannula insertion for patients requiring ongoing intravenous access in a comfortable home setting.',
    icon: Syringe,
  },
  {
    title: 'IV Drip Administration',
    description:
      'Supervised intravenous fluid and medication infusion with continuous monitoring to ensure safe and effective treatment delivery.',
    icon: Droplets,
  },
  {
    title: 'Wound Dressing',
    description:
      'Sterile wound cleaning and dressing changes using medical-grade supplies to promote healing and prevent infection at home.',
    icon: Bandage,
  },
  {
    title: 'Post Surgery Dressing',
    description:
      'Specialized postoperative wound care following surgical procedures, ensuring hygienic dressing changes and recovery monitoring.',
    icon: Scissors,
  },
  {
    title: 'Enema Procedure',
    description:
      'Medically guided enema administration performed with care and discretion by trained nursing professionals in the privacy of your home.',
    icon: Activity,
  },
  {
    title: 'Colostomy/Ostomy Care',
    description:
      'Comprehensive ostomy bag management including cleaning, pouch replacement, and skin care by experienced healthcare providers.',
    icon: Package,
  },
  {
    title: 'Nebulization',
    description:
      'Respiratory therapy through nebulizer sessions to deliver medication directly to the lungs for conditions like asthma and bronchitis.',
    icon: Wind,
  },
  {
    title: 'BP Monitoring',
    description:
      'Accurate blood pressure measurement and recording using calibrated equipment, with guidance on managing hypertension or hypotension.',
    icon: HeartPulse,
  },
  {
    title: 'Sugar Monitoring',
    description:
      'Regular blood glucose level checks using reliable glucometers, helping patients maintain optimal diabetes control at home.',
    icon: Activity,
  },
];

// ============================
// Injection & Vaccination Items
// ============================

const injectionVaccination = [
  {
    title: 'IM Injection',
    description:
      'Safe and precise intramuscular injection service for prescribed medications, administered by qualified nursing staff at your doorstep.',
    icon: Syringe,
  },
  {
    title: 'IV Injection',
    description:
      'Professional intravenous injection delivery ensuring accurate dosage and sterile technique by certified healthcare practitioners.',
    icon: Syringe,
  },
  {
    title: 'Insulin Injection',
    description:
      'Assisted insulin administration for diabetic patients who need help with correct dosage, injection sites, and timing management.',
    icon: Pill,
  },
  {
    title: 'Vitamin Injections',
    description:
      'Intramuscular vitamin supplementation including B12, D, and other essential nutrients to address deficiencies and boost vitality.',
    icon: ShieldPlus,
  },
  {
    title: 'Adult Vaccination',
    description:
      'Convenient at-home vaccination services for adults including influenza, hepatitis, pneumonia, and other recommended immunizations.',
    icon: Users,
  },
  {
    title: 'Elderly Vaccination',
    description:
      'Specialized vaccination care for senior citizens, ensuring comfort and safety for age-appropriate immunizations at home.',
    icon: Baby,
  },
];

// ============================
// Reusable Service Card
// ============================

function ServiceCard({
  title,
  description,
  icon: Icon,
  buttonLabel,
  onBook,
  onClickCard,
  index,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  buttonLabel: string;
  onBook: () => void;
  onClickCard: () => void;
  index: number;
}) {
  return (
    <div
      onClick={onClickCard}
      className="group relative p-4 lg:p-6 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all duration-300 card-hover flex flex-col items-center lg:items-start text-center lg:text-left cursor-pointer lg:cursor-default"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-text-primary mb-1 lg:mb-2 leading-tight lg:leading-normal">{title}</h3>
      <p className="text-text-secondary text-xs sm:text-sm lg:text-base leading-snug lg:leading-relaxed mb-3 lg:mb-5 line-clamp-2 lg:line-clamp-none flex-1">
        {description}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBook();
        }}
        className="hidden lg:block self-start px-5 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all duration-300"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

// ============================
// Main Services Component
// ============================

interface ServicesProps {
  onBookService: (service: string) => void;
}

export default function Services({ onBookService }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<{
    title: string;
    description: string;
    icon: React.ElementType;
  } | null>(null);
  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services"
      className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      <ServiceDetailsModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        onRequestCallback={onBookService}
      />
      {/* Background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary-dark text-sm font-semibold mb-4">
            <Activity className="w-4 h-4" />
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Professional Healthcare{' '}
            <span className="gradient-text">At Home</span>
          </h2>
          <p className="text-text-secondary text-base lg:text-lg">
            We offer a comprehensive range of home healthcare services
            administered by certified medical professionals.
          </p>
        </div>



        {/* ======================== */}
        {/* Lab Tests Section */}
        {/* ======================== */}
        <div id="lab-tests" className="mb-12 lg:mb-20">
          <div className="mb-6 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3">
              Lab Tests <span className="gradient-text">at Home</span>
            </h2>
            <p className="text-text-secondary text-base lg:text-lg max-w-2xl">
              Professional sample collection and diagnostic testing from the
              comfort of your home.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {labTests.map((item, i) => (
              <ServiceCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={item.icon}
                buttonLabel="Book Test"
                onBook={() => onBookService(item.title)}
                onClickCard={() => {
                  if (window.innerWidth < 1024) {
                    setSelectedService(item);
                  }
                }}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* ======================== */}
        {/* Nursing Procedures Section */}
        {/* ======================== */}
        <div id="nursing-procedures" className="mb-12 lg:mb-20">
          <div className="mb-6 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3">
              Nursing Procedures{' '}
              <span className="gradient-text">at Home</span>
            </h2>
            <p className="text-text-secondary text-base lg:text-lg max-w-2xl">
              Experienced healthcare professionals provide safe and hygienic
              nursing procedures at home.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {nursingProcedures.map((item, i) => (
              <ServiceCard
                key={item.title + '-nursing'}
                title={item.title}
                description={item.description}
                icon={item.icon}
                buttonLabel="Book Service"
                onBook={() => onBookService(item.title)}
                onClickCard={() => {
                  if (window.innerWidth < 1024) {
                    setSelectedService(item);
                  }
                }}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* ======================== */}
        {/* Injection & Vaccination Section */}
        {/* ======================== */}
        <div id="injection-vaccination">
          <div className="mb-6 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3">
              Injection & Vaccination{' '}
              <span className="gradient-text">at Home</span>
            </h2>
            <p className="text-text-secondary text-base lg:text-lg max-w-2xl">
              Safe administration of prescribed injections and vaccinations at
              your home by trained healthcare professionals.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {injectionVaccination.map((item, i) => (
              <ServiceCard
                key={item.title + '-injection'}
                title={item.title}
                description={item.description}
                icon={item.icon}
                buttonLabel="Book Service"
                onBook={() => onBookService(item.title)}
                onClickCard={() => {
                  if (window.innerWidth < 1024) {
                    setSelectedService(item);
                  }
                }}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

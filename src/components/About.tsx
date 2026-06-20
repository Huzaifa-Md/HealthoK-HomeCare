'use client';

import {
  Heart,
  Target,
  Award,
  Users,
  Clock,
  ShieldCheck,
  Stethoscope,
  Headphones,
} from 'lucide-react';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Certified Staff',
    desc: 'All our healthcare professionals are certified and experienced.',
  },
  {
    icon: Clock,
    title: 'Quick Response',
    desc: 'We reach your doorstep within 30-60 minutes of booking.',
  },
  {
    icon: Stethoscope,
    title: 'Quality Equipment',
    desc: 'We use sterile, medical-grade equipment for every procedure.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Our support team is always available for emergencies.',
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="content-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Heart className="w-4 h-4" />
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Your Trusted Partner in{' '}
            <span className="gradient-text">Home Healthcare</span>
          </h2>
          <p className="text-text-secondary text-lg font-medium leading-relaxed">
            Patient Care Home Services is dedicated to bringing professional
            medical care to your doorstep. We believe that quality healthcare
            should be accessible, affordable, and comfortable.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Mission & Vision */}
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Our Mission</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">
                To make Professional Expert At Home services accessible to every
                household by providing affordable, reliable, and compassionate
                home care services through certified medical professionals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  Patient-First Approach
                </h3>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Every decision we make puts our patients first. From choosing
                the right professionals to ensuring safety protocols — we are
                committed to providing the highest standard of home care.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '1000+', label: 'Patients Served' },
                { value: '15+', label: 'Services' },
                { value: '4.9', label: 'Rating' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-xl bg-white border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Why Choose Us */}
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-8">
              Why Choose Patient Care Home Services?
            </h3>
            <div className="space-y-5">
              {reasons.map((item, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      {item.title}
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

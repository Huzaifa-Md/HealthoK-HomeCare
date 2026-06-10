'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Are your staff certified and background-checked?',
    a: 'Yes, absolutely. All our healthcare professionals—including nurses, attendants, and physiotherapists—are fully certified, licensed, and have undergone rigorous background checks. We also provide continuous training to ensure high-quality care.',
  },
  {
    q: 'Do you provide emergency or urgent care services?',
    a: 'No, we do NOT provide emergency or urgent care services. We offer scheduled home healthcare services only. In case of a medical emergency, please call an ambulance or visit the nearest hospital immediately.',
  },
  {
    q: 'What areas do you currently serve?',
    a: 'We currently provide home healthcare services across Rajendra Nagar, Raj Nagar Extension, and Shalimar Garden in Ghaziabad. We are actively working on expanding to more regions in the near future.',
  },
  {
    q: 'How do I book a service and what are the payment methods?',
    a: 'You can book by calling us directly at 9870270197 or messaging us on WhatsApp. We accept online payments (UPI, Netbanking, Credit/Debit cards) as well as cash. Payments can be made on a daily, weekly, or monthly basis depending on the service duration.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Find quick answers to common questions about our services.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === i
                  ? 'border-primary/20 bg-primary/[0.02] shadow-lg shadow-primary/5'
                  : 'border-border bg-white hover:border-primary/10'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span
                  className={`font-semibold pr-4 transition-colors ${
                    openIndex === i ? 'text-primary' : 'text-text-primary'
                  }`}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                    openIndex === i
                      ? 'rotate-180 text-primary'
                      : 'text-text-muted'
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-60' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-text-secondary leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

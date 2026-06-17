'use client';

import { Headphones, PhoneCall, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface ContactProps {
  onRequestCallback: () => void;
}

export default function Contact({ onRequestCallback }: ContactProps) {
  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="content-container max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Headphones className="w-4 h-4" />We're Here to Help
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-text-secondary text-lg font-medium">
            Our medical professionals are ready to provide the best home healthcare services. Request a callback to schedule your service.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: CTA & Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-border shadow-xl shadow-primary/5">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Need Help Choosing a Service?
              </h3>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Our team is available to help you select the right home healthcare service and answer your questions.
              </p>
              
              <button
                onClick={onRequestCallback}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
              >
                <PhoneCall className="w-6 h-6" />
                Request Callback Now
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-1">Availability</p>
                  <p className="text-text-secondary text-sm font-medium">24/7 Home Service</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-border">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-1">Service Area</p>
                  <p className="text-text-secondary text-sm font-medium">Ghaziabad & nearby</p>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              {[
                'Certified medical professionals',
                'Sterile and hygienic procedures',
                'Fast response times',
                'Transparent service process'
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-text-secondary">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Map */}
          <div className="rounded-3xl overflow-hidden border border-border shadow-2xl h-96 lg:h-full min-h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56031.7!2d77.39!3d28.66!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1bb!2sGhaziabad!5e0!3m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              title="Service Area" 
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

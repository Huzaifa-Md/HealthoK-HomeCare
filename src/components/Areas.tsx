'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import ServiceDetailsModal from './ServiceDetailsModal';

const areas = [
  {
    name: 'Rajendra Nagar',
    desc: 'Complete home healthcare coverage across Rajendra Nagar and surrounding localities.',
    gradient: 'from-primary to-accent',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rajendra+Nagar,+Ghaziabad',
  },
  {
    name: 'Raj Nagar Extension',
    desc: 'Serving all residential societies and apartments in Raj Nagar Extension.',
    gradient: 'from-accent to-secondary',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Raj+Nagar+Extension,+Ghaziabad',
  },
  {
    name: 'Shalimar Garden',
    desc: 'Full home healthcare services available throughout Shalimar Garden area.',
    gradient: 'from-secondary to-primary',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shalimar+Garden,+Ghaziabad',
  },
];

interface AreasProps {
  onBookService?: (service: string) => void;
}

export default function Areas({ onBookService }: AreasProps) {
  const [selectedArea, setSelectedArea] = useState<{
    title: string;
    description: string;
    icon: React.ElementType;
  } | null>(null);
  return (
    <section id="areas" className="section-padding bg-white relative overflow-hidden">
      <ServiceDetailsModal
        isOpen={!!selectedArea}
        onClose={() => setSelectedArea(null)}
        service={selectedArea}
        onRequestCallback={(title) => {
          if (onBookService) onBookService(`Service in ${title}`);
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />

      <div className="content-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <MapPin className="w-4 h-4" />
            Service Areas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Areas We <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-text-secondary text-lg">
            We currently provide home healthcare services in the following areas
            of Ghaziabad, with plans to expand soon.
          </p>
        </div>

        {/* Areas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {areas.map((area, i) => (
            <div
              key={i}
              className="group relative h-full flex flex-col p-4 lg:p-8 rounded-2xl bg-white border border-border hover:border-transparent hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 card-hover overflow-hidden cursor-pointer lg:cursor-default"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSelectedArea({
                    title: area.name,
                    description: area.desc,
                    icon: Navigation,
                  });
                }
              }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10 flex flex-col h-full items-center lg:items-start text-center lg:text-left">
                <div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:bg-white/20 flex items-center justify-center mb-3 lg:mb-6 transition-all">
                    <Navigation className="w-6 h-6 lg:w-8 lg:h-8 text-primary group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-lg lg:text-xl font-bold text-text-primary group-hover:text-white mb-2 transition-colors leading-tight lg:leading-normal">
                    {area.name}
                  </h3>
                  <p className="hidden lg:block text-text-secondary group-hover:text-white/80 leading-relaxed transition-colors flex-1 w-full">
                    {area.desc}
                  </p>
                </div>

                <a
                  href={area.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                    }
                  }}
                  className="hidden lg:inline-flex mt-auto pt-6 items-center gap-2 text-primary group-hover:text-white/90 text-sm font-semibold transition-colors w-fit"
                >
                  <MapPin className="w-4 h-4" />
                  View on map
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

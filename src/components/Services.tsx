'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Service } from '@/lib/types';
import ServiceDetailsModal from './ServiceDetailsModal';
import { Package, Loader2, Bandage, Syringe, HeartPulse, TestTube } from 'lucide-react';

interface ServicesProps {
  onBookService: (service: string) => void;
}

const FIXED_CATEGORIES = [
  { id: 'nursing-procedures', name: 'Nursing Procedures', icon: Bandage },
  { id: 'injection-services', name: 'Injection Services', icon: Syringe },
  { id: 'vaccination', name: 'Vaccination', icon: Syringe },
  { id: 'health-checkup', name: 'Health Check-up Packages', icon: HeartPulse },
  { id: 'lab-tests', name: 'Lab Tests', icon: TestTube }
];

const FALLBACK_SERVICES: Service[] = [
  // Nursing Procedures
  { id: '1', category: 'Nursing Procedures', service_name: 'IM Injection Services at Home', description: 'Safe intramuscular injections administered by trained nurses.', is_active: true, display_order: 1 },
  { id: '2', category: 'Nursing Procedures', service_name: 'IV Injection at Home', description: 'Intravenous medication delivery with proper monitoring.', is_active: true, display_order: 2 },
  { id: '3', category: 'Nursing Procedures', service_name: 'Cannula Insertion at Home', description: 'Professional insertion for IV therapies or fluids.', is_active: true, display_order: 3 },
  { id: '4', category: 'Nursing Procedures', service_name: 'Stoma Bag Change and Care', description: 'Hygienic stoma management to prevent complications.', is_active: true, display_order: 4 },
  { id: '5', category: 'Nursing Procedures', service_name: 'Catheter Change at Home', description: 'Insertion and replacement performed with clinical care.', is_active: true, display_order: 5 },
  { id: '6', category: 'Nursing Procedures', service_name: 'IV Drip at Home', description: 'Fluid and medication administration under supervision.', is_active: true, display_order: 6 },
  { id: '7', category: 'Nursing Procedures', service_name: 'Dressing at Home', description: 'Wound dressing for injury, surgery, or chronic wounds.', is_active: true, display_order: 7 },
  { id: '8', category: 'Nursing Procedures', service_name: 'Ryles Tube Insertion', description: 'Nutritional support through safe tube placement.', is_active: true, display_order: 8 },
  // Injection Services
  { id: '9', category: 'Injection Services', service_name: 'IVF and Hormonal Injections', description: 'Administered safely as per medical prescription.', is_active: true, display_order: 1 },
  { id: '10', category: 'Injection Services', service_name: 'IV Antibiotic Administration', description: 'Ensures accurate dosing and monitoring at home.', is_active: true, display_order: 2 },
  { id: '11', category: 'Injection Services', service_name: 'Vitamin B12 and D3 Shots', description: 'Supports nutritional management and deficiency correction.', is_active: true, display_order: 3 },
  // Vaccination
  { id: '11a', category: 'Vaccination', service_name: 'Pediatric Vaccination', description: 'Comprehensive childhood immunization services administered safely at home according to recommended vaccination schedules.', is_active: true, display_order: 1 },
  { id: '12', category: 'Vaccination', service_name: 'Adult Vaccination', description: 'Routine and preventive vaccinations administered at home.', is_active: true, display_order: 2 },
  { id: '13', category: 'Vaccination', service_name: 'Elderly Vaccination', description: 'Recommended vaccinations for senior citizens delivered at home.', is_active: true, display_order: 3 },
  // Health Check-up Packages
  { id: '14', category: 'Health Check-up Packages', service_name: 'General Full Body Check-up', description: 'Comprehensive health screening covering major health parameters.', is_active: true, display_order: 1 },
  { id: '15', category: 'Health Check-up Packages', service_name: 'Full Body Check-up for Men', description: 'Health package focused on men\'s preventive healthcare needs.', is_active: true, display_order: 2 },
  { id: '16', category: 'Health Check-up Packages', service_name: 'Full Body Check-up for Women', description: 'Comprehensive health screening tailored for women\'s healthcare.', is_active: true, display_order: 3 },
  { id: '17', category: 'Health Check-up Packages', service_name: 'Full Body Check-up for Senior Citizens', description: 'Specialized health screening focused on age-related concerns.', is_active: true, display_order: 4 },
  // Lab Tests
  { id: '18', category: 'Lab Tests', service_name: 'Blood Test', description: 'Home blood sample collection supporting timely diagnosis and monitoring.', is_active: true, display_order: 1 },
  { id: '19', category: 'Lab Tests', service_name: 'Lipid Profile Test', description: 'Assesses cholesterol levels and cardiovascular risk.', is_active: true, display_order: 2 },
  { id: '20', category: 'Lab Tests', service_name: 'HbA1c Test', description: 'Used to monitor long-term blood sugar control.', is_active: true, display_order: 3 },
  { id: '21', category: 'Lab Tests', service_name: 'CBC Test', description: 'Complete blood count analysis for overall health assessment.', is_active: true, display_order: 4 },
  { id: '22', category: 'Lab Tests', service_name: 'Liver Function Test', description: 'Evaluates liver health and function.', is_active: true, display_order: 5 },
  { id: '23', category: 'Lab Tests', service_name: 'Kidney Function Test', description: 'Monitors kidney health and chronic condition risks.', is_active: true, display_order: 6 },
  { id: '24', category: 'Lab Tests', service_name: 'Vitamin D Test', description: 'Identifies vitamin D deficiency and nutritional concerns.', is_active: true, display_order: 7 },
  { id: '25', category: 'Lab Tests', service_name: 'Urine Routine Test', description: 'Evaluates urinary and kidney health through sample analysis.', is_active: true, display_order: 8 },
  { id: '26', category: 'Lab Tests', service_name: 'Double Marker Test', description: 'Prenatal screening test performed during pregnancy.', is_active: true, display_order: 9 },
];

export default function Services({ onBookService }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<{
    title: string;
    description: string;
    icon: React.ElementType;
  } | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (data && data.length > 0 && !error) {
          setServices(data);
        } else {
          setServices(FALLBACK_SERVICES);
        }
      } catch (err) {
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </section>
    );
  }

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

      <div className="content-container relative z-10">
        
        {FIXED_CATEGORIES.map((category) => {
          const categoryServices = services.filter(s => s.category === category.name);
          
          if (categoryServices.length === 0) return null;

          return (
            <div id={category.id} key={category.id} className="mb-12">
              <div className="mb-6 lg:mb-8 flex items-center gap-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {category.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                {categoryServices.map((item, i) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setSelectedService({
                          title: item.service_name,
                          description: item.description || '',
                          icon: category.icon
                        });
                      }
                    }}
                    className="group relative h-full flex flex-col p-3 sm:p-4 lg:p-6 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all duration-300 card-hover items-center lg:items-start text-center lg:text-left cursor-pointer lg:cursor-default"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-2 lg:mb-4 group-hover:scale-110 transition-transform shrink-0">
                      <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h4 className="text-[14px] sm:text-[15px] lg:text-lg font-semibold text-text-primary mb-1 lg:mb-2 leading-tight lg:leading-normal">
                      {item.service_name}
                    </h4>
                    <p className="text-text-secondary text-[12px] sm:text-[13px] lg:text-base leading-snug lg:leading-relaxed mb-3 lg:mb-6 flex-1 w-full">
                      {item.description}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookService(item.service_name);
                      }}
                      className="hidden lg:block w-fit px-5 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all duration-300 mt-auto"
                    >
                      Book Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
      </div>
    </section>
  );
}

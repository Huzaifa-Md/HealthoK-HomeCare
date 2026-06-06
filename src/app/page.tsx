'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServiceNavigation from '@/components/ServiceNavigation';
import About from '@/components/About';
import Services from '@/components/Services';
import Areas from '@/components/Areas';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CallbackModal from '@/components/CallbackModal';
import FloatingCallback from '@/components/FloatingCallback';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');

  const openModal = (service?: string) => {
    setPreselectedService(service || '');
    setModalOpen(true);
  };

  return (
    <main>
      <Navbar onRequestCallback={() => openModal()} />
      <Hero onRequestCallback={() => openModal()} />
      <ServiceNavigation />
      <About />
      <Services onBookService={(service) => openModal(service)} />
      <Areas onBookService={(service) => openModal(service)} />
      <Testimonials />
      <FAQ />
      <Contact onRequestCallback={() => openModal()} />
      <Footer onRequestCallback={() => openModal()} />
      <FloatingCallback onClick={() => openModal()} />
      <CallbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={preselectedService}
      />
    </main>
  );
}

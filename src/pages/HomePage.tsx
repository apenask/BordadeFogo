import React from 'react';
import HeroSection from '../components/HeroSection';
import PizzaBuilder from '../components/PizzaBuilder';
import MenuSection from '../components/MenuSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const HomePage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <PizzaBuilder />
      <MenuSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
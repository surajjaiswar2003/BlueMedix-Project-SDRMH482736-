
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import UserJourneySection from "@/components/UserJourneySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  // Smooth scroll effect for navigation
  useEffect(() => {
    const handleNavLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')!.substring(1);
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleNavLinkClick);
    return () => document.removeEventListener('click', handleNavLinkClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <UserJourneySection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

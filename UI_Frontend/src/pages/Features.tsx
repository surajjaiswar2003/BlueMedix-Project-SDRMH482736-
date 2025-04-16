
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/FeaturesSection";
import UserJourneySection from "@/components/UserJourneySection";
import AnimatedGradient from "@/components/ui/animated-gradient";
import { motion } from "framer-motion";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="relative overflow-hidden">
          <AnimatedGradient className="opacity-10" />
          <div className="container mx-auto px-4 py-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Our Features</h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8">
                Discover how MyDietDiary makes your nutrition journey simpler and more effective with our comprehensive set of features.
              </p>
            </motion.div>
          </div>
        </div>
        <FeaturesSection />
        <UserJourneySection />
      </main>
      <Footer />
    </div>
  );
};

export default Features;

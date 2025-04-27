
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedGradient from "@/components/ui/animated-gradient";
import { motion } from "framer-motion";
import AboutSection from "@/components/AboutSection";
import ProcessSection from "@/components/ProcessSection";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedGradient className="opacity-10" />
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">About MyDietDiary</h1>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg mb-6">
                At MyDietDiary, we believe that nutrition should be personalized. Our mission is to transform how people approach diet and nutrition by providing AI-powered, dietitian-approved meal plans tailored to individual health profiles, preferences, and goals.
              </p>
            </section>
          </motion.div>
        </div>
        
        <AboutSection />
        <ProcessSection />
        
        <div className="container mx-auto px-4 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-lg mb-6">
                MyDietDiary brings together a passionate team of nutritionists, data scientists, and healthcare professionals committed to revolutionizing personalized nutrition.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="text-center bg-white rounded-xl shadow-md p-6 transition-all duration-300"
                >
                  <div className="w-24 h-24 rounded-full bg-dietGreen/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-dietGreen font-bold">SJ</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-1">Dr. Sarah Johnson</h3>
                  <p className="text-sm text-gray-600 mb-3">Chief Nutritionist</p>
                  <p className="text-sm text-gray-700">Over 12 years of experience in clinical nutrition and personalized diet planning.</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="text-center bg-white rounded-xl shadow-md p-6 transition-all duration-300"
                >
                  <div className="w-24 h-24 rounded-full bg-dietBlue/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-dietBlue font-bold">MC</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-1">Michael Chen</h3>
                  <p className="text-sm text-gray-600 mb-3">Lead Data Scientist</p>
                  <p className="text-sm text-gray-700">Pioneer in applying machine learning to nutritional data for personalized recommendations.</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="text-center bg-white rounded-xl shadow-md p-6 transition-all duration-300"
                >
                  <div className="w-24 h-24 rounded-full bg-dietGreen-light/30 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-dietGreen-dark font-bold">ER</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-1">Emma Rodriguez</h3>
                  <p className="text-sm text-gray-600 mb-3">Dietitian Coordinator</p>
                  <p className="text-sm text-gray-700">Specializes in translating AI recommendations into practical, personalized meal plans.</p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

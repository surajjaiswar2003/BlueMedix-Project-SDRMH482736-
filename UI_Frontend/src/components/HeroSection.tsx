import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Apple, Salad, Heart, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedGradient from "./ui/animated-gradient";
import { useEffect, useState, useRef } from "react";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Array of image URLs for random rotation
  const images = [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"
  ];

  // State to track current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-transparent z-0"
      />
      
      <AnimatedGradient />
      
      {/* Floating elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-16 h-16 bg-dietGreen-light/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-20 w-24 h-24 bg-dietBlue-light/20 rounded-full blur-xl"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div custom={0} variants={fadeIn} className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-dietGreen" />
                <span className="text-sm font-medium text-dietGreen bg-dietGreen-light/20 px-3 py-1 rounded-full">
                  AI-Powered Nutrition
                </span>
              </motion.div>

              <motion.h1 
                custom={1} 
                variants={fadeIn} 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Smart <span className="text-dietGreen">Nutrition</span>, 
                <br />
                Tailored For <span className="text-dietBlue">You</span>
              </motion.h1>
              
              <motion.p 
                custom={2} 
                variants={fadeIn} 
                className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed"
              >
                Get personalized diet recommendations based on your unique health profile, lifestyle, and preferences. Your journey to better health starts here.
              </motion.p>
              
              <motion.div 
                custom={3} 
                variants={fadeIn} 
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register">
                  <Button size="lg" className="font-medium bg-dietGreen text-white hover:bg-dietGreen-dark px-8 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-dietGreen/20">
                    Start Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline" className="font-medium border-dietBlue text-dietBlue hover:bg-dietBlue-light/20 px-8 transition-all duration-300 transform hover:scale-105">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                custom={4} 
                variants={fadeIn} 
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                <div className="flex items-center text-sm font-medium text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <span>Healthy Living</span>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <Apple className="h-5 w-5 text-dietGreen mr-2" />
                  <span>Nutritionist Approved</span>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <Salad className="h-5 w-5 text-dietBlue mr-2" />
                  <span>Personalized Plans</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-dietGreen-light/30 to-dietBlue-light/30 rounded-2xl transform rotate-6 scale-105 blur-xl"></div>
              
              {/* Image slideshow */}
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-xl shadow-2xl"
              >
                <img 
                  src={images[currentImageIndex]} 
                  alt="Healthy Nutrition" 
                  className="relative w-full max-w-full md:max-w-md rounded-xl shadow-2xl transform transition-transform duration-500 hover:-rotate-2 hover:scale-105 object-cover aspect-[4/3]" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white text-sm md:text-base font-medium">Healthy Nutrition Image {currentImageIndex + 1}</p>
                </div>
              </motion.div>
              
              {/* Image indicator dots */}
              <div className="flex justify-center mt-6 gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index ? "bg-dietGreen w-6" : "bg-gray-300 w-2"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;

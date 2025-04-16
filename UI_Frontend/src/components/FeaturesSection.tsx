
import { 
  Activity, 
  Utensils, 
  Clipboard, 
  LineChart, 
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const features = [
  {
    icon: <Clipboard className="h-8 w-8 md:h-10 md:w-10 text-dietGreen" />,
    title: "Personalized Diet Plans",
    description: "Get diet recommendations tailored to your health conditions, BMI, activity level, lifestyle, and preferences."
  },
  {
    icon: <Activity className="h-8 w-8 md:h-10 md:w-10 text-dietGreen" />,
    title: "Real-time Health Tracking",
    description: "Log your daily activities, sleep, water intake, and meals to see your progress over time."
  },
  {
    icon: <Utensils className="h-8 w-8 md:h-10 md:w-10 text-dietGreen" />,
    title: "AI-Powered Suggestions",
    description: "Our advanced algorithms analyze your data to provide intelligent diet and lifestyle recommendations."
  },
  {
    icon: <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-dietGreen" />,
    title: "Expert Dietitian Support",
    description: "Get your personalized diet plans reviewed and approved by qualified dietitians."
  },
  {
    icon: <LineChart className="h-8 w-8 md:h-10 md:w-10 text-dietGreen" />,
    title: "Progress Visualization",
    description: "Track your journey with intuitive charts and reports showing your improvements over time."
  }
];

const FeaturesSection = () => {
  const isMobile = useIsMobile();
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Key Features</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Discover how MyDietDiary makes your nutrition journey simpler and more effective.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="feature-card flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-white h-full"
              whileHover={{ scale: isMobile ? 1 : 1.03 }}
            >
              <div className="relative mb-3 mt-4 md:mb-4 md:mt-6">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-dietGreen-light/40 to-dietBlue-light/40 opacity-70 blur-sm"></div>
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 px-2">{feature.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground px-4 pb-4 md:pb-6">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

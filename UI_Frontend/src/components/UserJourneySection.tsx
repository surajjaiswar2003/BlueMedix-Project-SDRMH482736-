
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserPlus, 
  ClipboardList, 
  Utensils, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const steps = [
  {
    icon: <UserPlus className="h-8 w-8 md:h-12 md:w-12 text-dietBlue" />,
    title: "Register",
    description: "Create your account and profile with basic information."
  },
  {
    icon: <ClipboardList className="h-8 w-8 md:h-12 md:w-12 text-dietBlue" />,
    title: "Log Health Parameters",
    description: "Enter your health conditions, BMI data, activity level, and preferences."
  },
  {
    icon: <Utensils className="h-8 w-8 md:h-12 md:w-12 text-dietBlue" />,
    title: "Get Personalized Plan",
    description: "Receive AI-generated diet recommendations approved by dietitians."
  },
  {
    icon: <TrendingUp className="h-8 w-8 md:h-12 md:w-12 text-dietBlue" />,
    title: "Track & Improve",
    description: "Log your daily activities and see your progress over time."
  }
];

const UserJourneySection = () => {
  const isMobile = useIsMobile();
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-10 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">How It Works</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Your journey to personalized nutrition in four simple steps
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-[calc(12.5%)] right-[calc(12.5%)] h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={item} className="relative">
                <Card className="shadow-sm bg-white z-10 h-full">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                    <div className="bg-blue-50 p-3 md:p-4 rounded-full mb-3 md:mb-4">{step.icon}</div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                    <div className="bg-white rounded-full p-1">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UserJourneySection;

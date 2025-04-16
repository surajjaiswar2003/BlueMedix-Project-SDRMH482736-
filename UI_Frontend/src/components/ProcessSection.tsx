
import { motion } from "framer-motion";
import { 
  UserPlus, 
  ClipboardList, 
  Cpu, 
  CheckCircle, 
  BarChart, 
  MessageCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const ProcessSection = () => {
  const isMobile = useIsMobile();
  
  const steps = [
    {
      icon: <UserPlus className="h-6 w-6 text-white" />,
      number: "01",
      title: "Register & Input Parameters",
      description: "Create your profile with 40 comprehensive health, lifestyle, and dietary parameters that help us understand your unique needs.",
      bgColor: "from-dietGreen to-dietGreen-dark",
      delay: 0.1
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-white" />,
      number: "02",
      title: "AI Analysis",
      description: "Our machine learning model processes your data using advanced algorithms to identify your optimal nutritional needs.",
      bgColor: "from-dietBlue to-dietBlue-dark",
      delay: 0.2
    },
    {
      icon: <Cpu className="h-6 w-6 text-white" />,
      number: "03",
      title: "Plan Generation",
      description: "The system generates a personalized nutrition plan tailored specifically to your body, lifestyle, and preferences.",
      bgColor: "from-dietGreen-light to-dietGreen",
      delay: 0.3
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      number: "04",
      title: "Expert Dietitian Review",
      description: "Professional dietitians review your AI-generated plan, making expert adjustments to ensure optimal nutrition and practicality.",
      bgColor: "from-dietBlue-light to-dietBlue",
      delay: 0.4
    },
    {
      icon: <BarChart className="h-6 w-6 text-white" />,
      number: "05",
      title: "Track & Monitor",
      description: "Log your daily nutrition, activities, and health metrics to track your progress and see real-time improvements.",
      bgColor: "from-dietGreen to-dietGreen-dark",
      delay: 0.5
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      number: "06",
      title: "Ongoing Adaptation",
      description: "Your plan continuously evolves based on your progress, feedback, and changing needs to ensure optimal results over time.",
      bgColor: "from-dietBlue to-dietBlue-dark",
      delay: 0.6
    }
  ];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Process</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            We've developed a comprehensive system that combines artificial intelligence with expert human oversight to deliver truly personalized nutrition
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: step.delay }}
              whileHover={isMobile ? {} : { y: -10, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="border-0 shadow-lg h-full overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${step.bgColor}`}></div>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.bgColor} flex items-center justify-center mr-4`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Step {step.number}</div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">The Science Behind Our Process</h3>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-semibold mb-2 text-dietGreen">Machine Learning Approach</h4>
              <p className="text-gray-700 mb-3">
                Our system uses a combination of K-Means clustering, Random Forest, and Decision Trees to analyze over 40 unique parameters, creating nutrition recommendations with exceptional accuracy.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-dietBlue">40+</div>
                  <div className="text-xs text-gray-500">Parameters</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-dietBlue">93%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-dietBlue">10k+</div>
                  <div className="text-xs text-gray-500">Training Recipes</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-dietBlue">98%</div>
                  <div className="text-xs text-gray-500">User Satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h4 className="font-semibold mb-2 text-dietGreen">Human Expert Oversight</h4>
                <p className="text-gray-700 text-sm">
                  Our team of qualified dietitians reviews every AI-generated plan, ensuring that the science is properly applied to real-world nutrition needs and preferences.
                </p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg">
                <h4 className="font-semibold mb-2 text-dietGreen">Continuous Improvement</h4>
                <p className="text-gray-700 text-sm">
                  The system learns from user feedback, tracking, and results, constantly improving its recommendations for both you and all future users.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;

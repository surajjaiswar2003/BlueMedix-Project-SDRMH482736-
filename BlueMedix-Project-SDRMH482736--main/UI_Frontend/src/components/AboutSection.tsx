
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Award, Sparkles } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-dietGreen-light/20 to-dietBlue-light/20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="inline-block px-3 py-1 bg-dietGreen-light/30 text-dietGreen-dark rounded-full text-sm font-medium mb-4">Our Approach</span>
          <h2 className="text-3xl font-bold mb-4">Why MyDietDiary?</h2>
          <p className="text-lg text-muted-foreground">
            MyDietDiary uses advanced algorithms and expert knowledge to create truly personalized nutrition plans that adapt to your unique needs and goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-md border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-dietGreen to-dietGreen-light"></div>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center">
                  <div className="p-3 rounded-lg bg-dietGreen/10 mr-4">
                    <Heart className="h-6 w-6 text-dietGreen" />
                  </div>
                  <h3 className="text-xl font-semibold">Why Personalized Nutrition Matters</h3>
                </div>
                <p className="leading-relaxed text-gray-600">
                  Everyone's body is different. What works for one person may not work for another. Our system takes into account <span className="font-medium text-dietGreen">40 unique parameters</span> spanning health conditions, BMI data, physical activity, lifestyle factors, and dietary preferences to create a diet plan that is truly tailored to you.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-dietBlue to-dietBlue-light"></div>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center">
                  <div className="p-3 rounded-lg bg-dietBlue/10 mr-4">
                    <Award className="h-6 w-6 text-dietBlue" />
                  </div>
                  <h3 className="text-xl font-semibold">Expert-Validated Recommendations</h3>
                </div>
                <p className="leading-relaxed text-gray-600">
                  All diet plans are reviewed by qualified dietitians before being recommended to users. This dual approach of <span className="font-medium text-dietBlue">AI-powered suggestions with human expert validation</span> ensures you get scientifically sound advice that's practical for your daily life.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="shadow-md border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-dietGreen-light to-dietBlue-light"></div>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-dietGreen/10 to-dietBlue/10 mr-4">
                    <Sparkles className="h-6 w-6 text-dietGreen-dark" />
                  </div>
                  <h3 className="text-xl font-semibold">Continuous Adaptation</h3>
                </div>
                <p className="leading-relaxed text-gray-600">
                  Unlike static diet plans, our recommendations evolve with you. As you log your progress and habits change, our system continuously refines its suggestions to help you achieve optimal results. This dynamic approach ensures your nutrition plan is always aligned with your current needs and goals.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

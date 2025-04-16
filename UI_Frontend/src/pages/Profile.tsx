
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HealthConditionsForm from "@/components/profile/HealthConditionsForm";
import BMIForm from "@/components/profile/BMIForm";
import PhysicalActivityForm from "@/components/profile/PhysicalActivityForm";
import LifestyleForm from "@/components/profile/LifestyleForm";
import DietaryPreferencesForm from "@/components/profile/DietaryPreferencesForm";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define all the form steps
const FORM_STEPS = [
  "health",
  "bmi",
  "physical",
  "lifestyle",
  "dietary",
  "review"
];

const Profile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Health Conditions
    diabetes: "",
    hypertension: "",
    cardiovascular: "",
    digestiveDisorders: "",
    foodAllergies: [],
    
    // BMI Related
    height: "",
    weight: "",
    bmiCategory: "",
    targetWeight: "",
    weightChangeHistory: "",
    
    // Physical Activity
    exerciseFrequency: "",
    exerciseDuration: "",
    exerciseType: "",
    dailyStepsCount: "",
    physicalJobActivityLevel: "",
    
    // Lifestyle
    workSchedule: "",
    sleepDuration: "",
    sleepQuality: "",
    stressLevel: "",
    mealTimingRegularity: "",
    cookingSkills: "",
    availableCookingTime: "",
    foodBudget: "",
    alcoholConsumption: "",
    smokingStatus: "",
    waterIntake: "",
    eatingOutFrequency: "",
    snackingBehavior: "",
    foodPrepTimeAvailability: "",
    travelFrequency: "",
    
    // Dietary Preferences
    dietType: "",
    mealSizePreference: "",
    spiceTolerance: "",
    cuisinePreferences: [],
    foodTexturePreferences: "",
    portionControlAbility: "",
    previousDietSuccessHistory: "",
    foodIntolerances: [],
    preferredMealComplexity: "",
    seasonalFoodPreferences: ""
  });

  const updateFormData = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  const goToNextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    console.log("Form data submitted:", formData);
    // Here you would send the data to your ML model
    alert("Your profile has been submitted successfully!");
    navigate("/");
  };

  // Determine which form to show based on current step
  const renderForm = () => {
    switch (FORM_STEPS[currentStep]) {
      case "health":
        return <HealthConditionsForm data={formData} updateData={updateFormData} />;
      case "bmi":
        return <BMIForm data={formData} updateData={updateFormData} />;
      case "physical":
        return <PhysicalActivityForm data={formData} updateData={updateFormData} />;
      case "lifestyle":
        return <LifestyleForm data={formData} updateData={updateFormData} />;
      case "dietary":
        return <DietaryPreferencesForm data={formData} updateData={updateFormData} />;
      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <p className="text-sm text-muted-foreground">
                Please review all your information before submitting
              </p>
            </div>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Your Health Profile</CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {FORM_STEPS.length}: {FORM_STEPS[currentStep].charAt(0).toUpperCase() + FORM_STEPS[currentStep].slice(1)}
              </CardDescription>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}
                ></div>
              </div>
            </CardHeader>
            <CardContent>
              <form>
                {renderForm()}
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < FORM_STEPS.length - 1 ? (
                    <Button type="button" onClick={goToNextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleSubmit}>
                      Submit Profile
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

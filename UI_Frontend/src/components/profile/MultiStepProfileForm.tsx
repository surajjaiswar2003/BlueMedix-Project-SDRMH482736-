import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import HealthConditionsForm from "./HealthConditionsForm";
import LifestyleForm from "./LifestyleForm";
import PhysicalActivityForm from "./PhysicalActivityForm";
import DietaryPreferencesForm from "./DietaryPreferencesForm";
import BMIForm from "./BMIForm";

interface FormData {
  // Health Conditions
  diabetes: string;
  hypertension: string;
  cardiovascular: string;
  digestiveDisorders: string;
  foodAllergies: string[];

  // Lifestyle
  workSchedule: string;
  sleepDuration: string;
  sleepQuality: string;
  stressLevel: string;
  mealTimingRegularity: string;
  cookingSkills: string;
  availableCookingTime: string;
  foodBudget: string;
  alcoholConsumption: string;
  smokingStatus: string;
  waterIntake: string;
  eatingOutFrequency: string;
  snackingBehavior: string;
  foodPrepTimeAvailability: string;
  travelFrequency: string;

  // Physical Activity
  exerciseFrequency: string;
  exerciseDuration: string;
  exerciseType: string;
  dailyStepsCount: string;
  physicalJobActivityLevel: string;

  // Dietary Preferences
  dietaryRestrictions: string[];
  preferredCuisines: string[];
  mealFrequency: string;
  portionSizePreference: string;
  cookingFrequency: string;
  foodPreferences: string[];
  dislikes: string[];

  // BMI
  height: string;
  weight: string;
  age: string;
  gender: string;
}

const MultiStepProfileForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    // Health Conditions
    diabetes: "none",
    hypertension: "no",
    cardiovascular: "absent",
    digestiveDisorders: "none",
    foodAllergies: [],

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

    // Physical Activity
    exerciseFrequency: "",
    exerciseDuration: "",
    exerciseType: "",
    dailyStepsCount: "",
    physicalJobActivityLevel: "",

    // Dietary Preferences
    dietaryRestrictions: [],
    preferredCuisines: [],
    mealFrequency: "",
    portionSizePreference: "",
    cookingFrequency: "",
    foodPreferences: [],
    dislikes: [],

    // BMI
    height: "",
    weight: "",
    age: "",
    gender: "",
  });

  const steps = [
    { title: "Health Conditions", component: HealthConditionsForm },
    { title: "Lifestyle", component: LifestyleForm },
    { title: "Physical Activity", component: PhysicalActivityForm },
    { title: "Dietary Preferences", component: DietaryPreferencesForm },
    { title: "BMI", component: BMIForm },
  ];

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentForm = steps[currentStep].component;

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Profile Completion</span>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((step, index) => (
            <span 
              key={index}
              className={`${index <= currentStep ? 'text-primary font-medium' : ''}`}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Current Step Title */}
      <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>

      {/* Form Component */}
      <CurrentForm data={formData} updateData={updateFormData} />

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MultiStepProfileForm; 
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import HealthConditionsForm from "./HealthConditionsForm";
import LifestyleForm from "./LifestyleForm";
import PhysicalActivityForm from "./PhysicalActivityForm";
import DietaryPreferencesForm from "./DietaryPreferencesForm";
import BMIForm from "./BMIForm";
import GenerateDietPlan from "./GenerateDietPlan";
import ReviewHealthParameters from "./ReviewHealthParameters";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  dietType: string;
  mealSizePreference: string;
  spiceTolerance: string;
  cuisinePreferences: string[];
  foodTexturePreferences: string;
  portionControlAbility: string;
  previousDietSuccessHistory: string;
  foodIntolerances: string[];
  preferredMealComplexity: string;
  seasonalFoodPreferences: string;

  // BMI
  height: string;
  weight: string;
  bmiCategory: string;
  targetWeight: string;
  weightChangeHistory: string;

  // API specific fields
  "Diet Type"?: string;
  "Meal Size Preference"?: string;
  "BMI Category"?: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Define a common interface for all form components
interface FormComponentProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

interface MultiStepProfileFormProps {
  onComplete?: () => void;
}

const MultiStepProfileForm: React.FC<MultiStepProfileFormProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    // Health Conditions
    diabetes: "none",
    hypertension: "no",
    cardiovascular: "absent",
    digestiveDisorders: "none",
    foodAllergies: [],

    // Lifestyle
    workSchedule: "regular",
    sleepDuration: "7-8",
    sleepQuality: "good",
    stressLevel: "medium",
    mealTimingRegularity: "regular",
    cookingSkills: "intermediate",
    availableCookingTime: "30-60",
    foodBudget: "medium",
    alcoholConsumption: "occasional",
    smokingStatus: "non-smoker",
    waterIntake: "8",
    eatingOutFrequency: "1-2",
    snackingBehavior: "average",
    foodPrepTimeAvailability: "few-days",
    travelFrequency: "monthly",

    // Physical Activity
    exerciseFrequency: "3",
    exerciseDuration: "30",
    exerciseType: "mixed",
    dailyStepsCount: "5000",
    physicalJobActivityLevel: "sedentary",

    // Dietary Preferences
    dietType: "omnivore",
    mealSizePreference: "regular",
    spiceTolerance: "medium",
    cuisinePreferences: ["mediterranean"],
    foodTexturePreferences: "mixed",
    portionControlAbility: "good",
    previousDietSuccessHistory: "yes",
    foodIntolerances: [],
    preferredMealComplexity: "moderate",
    seasonalFoodPreferences: "yes",

    // BMI
    height: "170",
    weight: "70",
    bmiCategory: "",
    targetWeight: "70",
    weightChangeHistory: "stable",

    // API specific fields
    "Diet Type": "Non-spicy",
    "Meal Size Preference": "Regular 3 meals",
    "BMI Category": "Normal",
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Get user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Check if user already has health parameters
    const fetchHealthParams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/health-parameters/${parsedUser._id}`
        );
        // Pre-fill form with existing data
        setFormData((prevData) => ({
          ...prevData,
          ...response.data,
          // Ensure API specific fields are set
          "Diet Type":
            response.data.dietType === "Vegetarian"
              ? "Vegetarian"
              : response.data.dietType === "Vegan"
              ? "Vegan"
              : response.data.dietType === "Pescatarian"
              ? "Pescatarian"
              : "Non-spicy",
          "Meal Size Preference":
            response.data.mealSizePreference || "Regular 3 meals",
          "BMI Category": response.data.bmiCategory || "Normal",
        }));
      } catch (error) {
        // If 404, health parameters don't exist yet
        console.log("No existing health parameters found or error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthParams();
  }, [navigate]);

  // Define steps with proper type annotations
  const steps = [
    {
      title: "Health Conditions",
      component:
        HealthConditionsForm as React.ComponentType<FormComponentProps>,
    },
    {
      title: "Lifestyle",
      component: LifestyleForm as React.ComponentType<FormComponentProps>,
    },
    {
      title: "Physical Activity",
      component:
        PhysicalActivityForm as React.ComponentType<FormComponentProps>,
    },
    {
      title: "Dietary Preferences",
      component:
        DietaryPreferencesForm as React.ComponentType<FormComponentProps>,
    },
    {
      title: "BMI",
      component: BMIForm as React.ComponentType<FormComponentProps>,
    },
    {
      title: "Review",
      component: ReviewHealthParameters as React.ComponentType<any>,
    },
    {
      title: "Diet Plan",
      component: GenerateDietPlan as React.ComponentType<FormComponentProps>,
    },
  ];

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...newData };

      // Update API-specific fields when their counterparts change
      if (newData.dietType) {
        updated["Diet Type"] =
          newData.dietType === "vegetarian"
            ? "Vegetarian"
            : newData.dietType === "vegan"
            ? "Vegan"
            : newData.dietType === "pescatarian"
            ? "Pescatarian"
            : "Non-spicy";
      }

      if (newData.mealSizePreference) {
        updated["Meal Size Preference"] =
          newData.mealSizePreference === "small"
            ? "Small frequent"
            : newData.mealSizePreference === "large"
            ? "Large infrequent"
            : "Regular 3 meals";
      }

      // Calculate BMI and set BMI Category if height and weight are provided
      if (
        (newData.height || newData.weight) &&
        updated.height &&
        updated.weight
      ) {
        const heightInMeters = parseFloat(updated.height) / 100;
        const weightInKg = parseFloat(updated.weight);

        if (heightInMeters > 0 && weightInKg > 0) {
          const bmi = weightInKg / (heightInMeters * heightInMeters);
          let bmiCategory = "Normal";

          if (bmi < 18.5) bmiCategory = "Underweight";
          else if (bmi < 25) bmiCategory = "Normal";
          else if (bmi < 30) bmiCategory = "Overweight";
          else bmiCategory = "Obese";

          updated.bmiCategory = bmiCategory;
          updated["BMI Category"] = bmiCategory;
        }
      }

      return updated;
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      console.log("Moving from step", currentStep, "to", currentStep + 1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const saveHealthParameters = async () => {
    // Just move to the next step without saving
    nextStep();
  };

  // Show loading state while fetching existing data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading your health information...
      </div>
    );
  }

  // Add type assertion for CurrentForm
  const CurrentForm = steps[currentStep]
    .component as React.ComponentType<FormComponentProps>;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Special props for the Review step
  const isReviewStep = currentStep === 5; // Review is the 6th step (index 5)

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Profile Completion</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}%
          </span>
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
              className={`${
                index <= currentStep ? "text-primary font-medium" : ""
              }`}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Current Step Title */}
      <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>

      {/* Form Component */}
      {isReviewStep ? (
        <ReviewHealthParameters
          data={formData}
          updateData={updateFormData}
          onSave={saveHealthParameters}
          onBack={prevStep}
        />
      ) : (
        <CurrentForm data={formData} updateData={updateFormData} />
      )}

      {/* Navigation Buttons */}
      {!isReviewStep && currentStep < steps.length - 1 && (
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button onClick={nextStep}>Next</Button>
        </div>
      )}
    </div>
  );
};

export default MultiStepProfileForm;

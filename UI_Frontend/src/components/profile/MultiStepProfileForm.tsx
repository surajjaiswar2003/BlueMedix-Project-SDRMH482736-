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
    { title: "Health Conditions", component: HealthConditionsForm as React.ComponentType<FormComponentProps> },
    { title: "Lifestyle", component: LifestyleForm as React.ComponentType<FormComponentProps> },
    { title: "Physical Activity", component: PhysicalActivityForm as React.ComponentType<FormComponentProps> },
    { title: "Dietary Preferences", component: DietaryPreferencesForm as React.ComponentType<FormComponentProps> },
    { title: "BMI", component: BMIForm as React.ComponentType<FormComponentProps> },
    { title: "Review", component: ReviewHealthParameters as React.ComponentType<any> },
    { title: "Diet Plan", component: GenerateDietPlan as React.ComponentType<FormComponentProps> },
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
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const saveHealthParameters = async () => {
    if (!user || !user._id) {
      console.error("User not authenticated");
      return;
    }

    try {
      // Transform form data to match schema requirements
      const transformedData = {
        // Health Conditions - Fix case and map to allowed enum values
        diabetes:
          formData.diabetes === "none"
            ? "None"
            : formData.diabetes === "type1"
            ? "Type 1"
            : formData.diabetes === "type2"
            ? "Type 2"
            : "None",

        hypertension: formData.hypertension === "yes" ? "Yes" : "No",

        cardiovascular:
          formData.cardiovascular === "present" ? "Present" : "Absent",

        digestiveDisorders:
          formData.digestiveDisorders === "none"
            ? "None"
            : formData.digestiveDisorders === "ibs"
            ? "IBS"
            : formData.digestiveDisorders === "celiac"
            ? "Celiac"
            : "None",

        // Food allergies - Pick one from the array or use "None"
        foodAllergies: formData.foodAllergies.includes("dairy")
          ? "Dairy"
          : formData.foodAllergies.includes("nuts")
          ? "Nuts"
          : formData.foodAllergies.includes("shellfish")
          ? "Shellfish"
          : "None",

        // Body metrics - Convert strings to numbers
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),

        // BMI Category - Use API-specific field with proper capitalization
        bmiCategory: formData["BMI Category"] || "Normal",

        targetWeight: parseFloat(formData.targetWeight),

        // Weight Change History - Map to allowed enum values
        weightChangeHistory:
          formData.weightChangeHistory === "stable" ? "Stable" : "Fluctuating",

        // Physical Activity - Convert strings to numbers
        exerciseFrequency: parseInt(formData.exerciseFrequency),
        exerciseDuration: parseInt(formData.exerciseDuration),

        // Exercise Type - Map to allowed enum values
        exerciseType:
          formData.exerciseType === "none"
            ? "None"
            : formData.exerciseType === "cardio"
            ? "Cardio"
            : formData.exerciseType === "strength"
            ? "Strength"
            : formData.exerciseType === "mixed"
            ? "Mixed"
            : "None",

        dailyStepsCount: parseInt(formData.dailyStepsCount),

        // Physical Job Activity Level - Fix case
        physicalJobActivityLevel:
          formData.physicalJobActivityLevel === "sedentary"
            ? "Sedentary"
            : formData.physicalJobActivityLevel === "moderate"
            ? "Moderate"
            : formData.physicalJobActivityLevel === "active"
            ? "Active"
            : "Sedentary",

        // Lifestyle - Fix case and convert to numbers where needed
        workSchedule:
          formData.workSchedule === "regular"
            ? "Regular"
            : formData.workSchedule === "flexible"
            ? "Flexible"
            : formData.workSchedule === "shift"
            ? "Shift"
            : "Regular",

        sleepDuration: parseFloat(formData.sleepDuration.split("-")[0]) || 7,

        sleepQuality:
          formData.sleepQuality === "poor"
            ? "Poor"
            : formData.sleepQuality === "fair"
            ? "Fair"
            : formData.sleepQuality === "good"
            ? "Good"
            : "Good",

        stressLevel:
          formData.stressLevel === "low"
            ? "Low"
            : formData.stressLevel === "medium"
            ? "Medium"
            : formData.stressLevel === "high"
            ? "High"
            : "Medium",

        mealTimingRegularity:
          formData.mealTimingRegularity === "regular" ? "Regular" : "Irregular",

        cookingSkills:
          formData.cookingSkills === "basic"
            ? "Basic"
            : formData.cookingSkills === "intermediate"
            ? "Intermediate"
            : formData.cookingSkills === "advanced"
            ? "Advanced"
            : "Intermediate",

        // Convert cooking time to minutes (numeric)
        availableCookingTime:
          formData.availableCookingTime === "less-than-15"
            ? 15
            : formData.availableCookingTime === "15-30"
            ? 30
            : formData.availableCookingTime === "30-60"
            ? 60
            : 30,

        foodBudget:
          formData.foodBudget === "low"
            ? "Low"
            : formData.foodBudget === "medium"
            ? "Medium"
            : formData.foodBudget === "high"
            ? "High"
            : "Medium",

        alcoholConsumption:
          formData.alcoholConsumption === "none"
            ? "None"
            : formData.alcoholConsumption === "occasional"
            ? "Occasional"
            : formData.alcoholConsumption === "regular"
            ? "Regular"
            : "None",

        smokingStatus:
          formData.smokingStatus === "non-smoker"
            ? "Non-smoker"
            : formData.smokingStatus === "former"
            ? "Former"
            : formData.smokingStatus === "smoker"
            ? "Smoker"
            : "Non-smoker",

        waterIntake: parseInt(formData.waterIntake),

        // Convert eating out frequency to number
        eatingOutFrequency:
          formData.eatingOutFrequency === "0"
            ? 0
            : formData.eatingOutFrequency === "1-2"
            ? 2
            : formData.eatingOutFrequency === "3-5"
            ? 5
            : formData.eatingOutFrequency === "5-7"
            ? 7
            : 2,

        snackingBehavior:
          formData.snackingBehavior === "regular"
            ? "Regular"
            : formData.snackingBehavior === "irregular"
            ? "Irregular"
            : formData.snackingBehavior === "average"
            ? "Average"
            : "Regular",

        // Convert food prep time to numeric value
        foodPreparationTimeAvailability:
          formData.foodPrepTimeAvailability === "weekends-only"
            ? 2
            : formData.foodPrepTimeAvailability === "few-days"
            ? 4
            : formData.foodPrepTimeAvailability === "daily"
            ? 7
            : 4,

        travelFrequency:
          formData.travelFrequency === "rarely"
            ? "Rarely"
            : formData.travelFrequency === "monthly"
            ? "Monthly"
            : formData.travelFrequency === "weekly"
            ? "Weekly"
            : "Rarely",

        // Dietary preferences
        dietType: formData["Diet Type"] || "Non-spicy",

        mealSizePreference:
          formData["Meal Size Preference"] || "Regular 3 meals",

        spiceTolerance:
          formData.spiceTolerance === "low"
            ? "Low"
            : formData.spiceTolerance === "medium"
            ? "Medium"
            : formData.spiceTolerance === "high"
            ? "High"
            : "Medium",

        // Pick one cuisine from the array
        cuisinePreferences: formData.cuisinePreferences.includes(
          "mediterranean"
        )
          ? "Mediterranean"
          : formData.cuisinePreferences.includes("asian")
          ? "Asian"
          : formData.cuisinePreferences.includes("western")
          ? "Western"
          : "Other",

        foodTexturePreferences:
          formData.foodTexturePreferences === "soft"
            ? "Soft"
            : formData.foodTexturePreferences === "crunchy"
            ? "Crunchy"
            : formData.foodTexturePreferences === "mixed"
            ? "Mixed"
            : "Mixed",

        portionControlAbility:
          formData.portionControlAbility === "poor"
            ? "Poor"
            : formData.portionControlAbility === "fair"
            ? "Fair"
            : formData.portionControlAbility === "good"
            ? "Good"
            : "Good",

        previousDietSuccessHistory:
          formData.previousDietSuccessHistory === "yes" ? "Yes" : "No",

        // Pick one intolerance from the array
        foodIntolerances: formData.foodIntolerances.includes("lactose")
          ? "Lactose"
          : formData.foodIntolerances.includes("gluten")
          ? "Gluten"
          : "None",

        preferredMealComplexity:
          formData.preferredMealComplexity === "simple"
            ? "Simple"
            : formData.preferredMealComplexity === "moderate"
            ? "Moderate"
            : formData.preferredMealComplexity === "complex"
            ? "Complex"
            : "Moderate",

        seasonalFoodPreferences:
          formData.seasonalFoodPreferences === "yes" ? "Yes" : "No",
      };

      // Send transformed data to the server
      await axios.post(
        `http://localhost:5000/api/health-parameters/${user._id}`,
        transformedData
      );

      // Move to the next step (Diet Plan generation)
      nextStep();
    } catch (error) {
      console.error("Error saving health parameters:", error);
      alert("Failed to save health parameters. Please try again.");
    }
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
  const CurrentForm = steps[currentStep].component as React.ComponentType<FormComponentProps>;
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

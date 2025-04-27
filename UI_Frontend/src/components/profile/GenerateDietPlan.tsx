// components/profile/GenerateDietPlan.tsx
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import DietPlanDisplay from "./DietPlanDisplay";
import DietPlanActions from "./DietPlanActions";

interface GenerateDietPlanProps {
  data: Record<string, any>; // This is the formData passed from parent
  updateData: (data: Partial<Record<string, any>>) => void;
}

const GenerateDietPlan: React.FC<GenerateDietPlanProps> = ({
  data,
  updateData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dietPlanData, setDietPlanData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const generateDietPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      // Transform form data to match API expectations
      const apiData = {
        // Health Conditions
        Diabetes:
          data?.diabetes === "type1"
            ? "Type 1"
            : data?.diabetes === "type2"
            ? "Type 2"
            : "None",
        Hypertension: data?.hypertension === "yes" ? "Yes" : "No",
        Cardiovascular:
          data?.cardiovascular === "present" ? "Present" : "Absent",
        "Digestive Disorders":
          data?.digestiveDisorders === "ibs"
            ? "IBS"
            : data?.digestiveDisorders === "celiac"
            ? "Celiac"
            : "Non-IBS",
        "Food Allergies": data?.foodAllergies?.includes("nuts")
          ? "Nuts"
          : data?.foodAllergies?.includes("dairy")
          ? "Dairy"
          : data?.foodAllergies?.includes("shellfish")
          ? "Shellfish"
          : "None",

        // BMI Related
        "Height (cm)": parseFloat(data?.height || "170"),
        "Weight (kg)": parseFloat(data?.weight || "70"),
        "BMI Category": data?.["BMI Category"] || "Normal",
        "Target Weight (kg)": parseFloat(data?.targetWeight || "70"),
        "Weight Change History":
          data?.weightChangeHistory === "stable" ? "Stable" : "Fluctuating",

        // Physical Activity
        "Exercise Frequency": parseInt(data?.exerciseFrequency || "3"),
        "Exercise Duration (min)": parseInt(data?.exerciseDuration || "30"),
        "Exercise Type":
          data?.exerciseType === "cardio"
            ? "Cardio"
            : data?.exerciseType === "strength"
            ? "Strength"
            : "Mixed",
        "Daily Steps Count": parseInt(data?.dailyStepsCount || "5000"),
        "Physical Job Activity Level":
          data?.physicalJobActivityLevel === "sedentary"
            ? "Sedentary"
            : data?.physicalJobActivityLevel === "moderate"
            ? "Moderate"
            : "Active",

        // Dietary Preferences
        "Diet Type": data?.["Diet Type"] || "Non-spicy",
        "Meal Size Preference":
          data?.["Meal Size Preference"] || "Regular 3 meals",
        "Spice Tolerance":
          data?.spiceTolerance === "low"
            ? "Low"
            : data?.spiceTolerance === "medium"
            ? "Medium"
            : "High",
        "Cuisine Preferences": data?.cuisinePreferences?.includes(
          "mediterranean"
        )
          ? "Mediterranean"
          : "Western",
        "Food Texture Preferences":
          data?.foodTexturePreferences === "soft"
            ? "Soft"
            : data?.foodTexturePreferences === "crunchy"
            ? "Crunchy"
            : "Mixed",
        "Portion Control Ability":
          data?.portionControlAbility === "poor"
            ? "Poor"
            : data?.portionControlAbility === "fair"
            ? "Fair"
            : "Good",
        "Previous Diet Success History":
          data?.previousDietSuccessHistory === "yes" ? "Yes" : "No",
        "Food Intolerances": data?.foodIntolerances?.includes("gluten")
          ? "Gluten"
          : "None",
        "Preferred Meal Complexity":
          data?.preferredMealComplexity === "simple"
            ? "Simple"
            : data?.preferredMealComplexity === "moderate"
            ? "Moderate"
            : "Complex",
        "Seasonal Food Preferences":
          data?.seasonalFoodPreferences === "yes" ? "Yes" : "No",
      };

      // Add all lifestyle parameters
      const lifestyleParams = {
        "Work Schedule":
          data?.workSchedule === "regular"
            ? "Regular"
            : data?.workSchedule === "shift"
            ? "Shift"
            : "Flexible",
        "Sleep Duration (hrs)": parseInt(data?.sleepDuration) || 7,
        "Sleep Quality":
          data?.sleepQuality === "poor"
            ? "Poor"
            : data?.sleepQuality === "fair"
            ? "Fair"
            : "Good",
        "Stress Level":
          data?.stressLevel === "low"
            ? "Low"
            : data?.stressLevel === "medium"
            ? "Medium"
            : "High",
        "Meal Timing Regularity":
          data?.mealTimingRegularity === "regular" ? "Regular" : "Irregular",
        "Cooking Skills":
          data?.cookingSkills === "basic"
            ? "Basic"
            : data?.cookingSkills === "intermediate"
            ? "Intermediate"
            : "Advanced",
        "Available Cooking Time (min)":
          parseInt(data?.availableCookingTime) || 30,
        "Food Budget":
          data?.foodBudget === "low"
            ? "Low"
            : data?.foodBudget === "medium"
            ? "Medium"
            : "High",
        "Alcohol Consumption":
          data?.alcoholConsumption === "none"
            ? "None"
            : data?.alcoholConsumption === "occasional"
            ? "Occasional"
            : "Regular",
        "Smoking Status":
          data?.smokingStatus === "non-smoker"
            ? "Non-smoker"
            : data?.smokingStatus === "former"
            ? "Former"
            : "Smoker",
        "Water Intake (cups)": parseInt(data?.waterIntake) || 8,
        "Eating Out Frequency": parseInt(data?.eatingOutFrequency) || 2,
        "Snacking Behavior":
          data?.snackingBehavior === "regular"
            ? "Regular"
            : data?.snackingBehavior === "average"
            ? "Average"
            : "Irregular",
        "Food Prep Time Availability (min)":
          parseInt(data?.foodPrepTimeAvailability) || 45,
        "Travel Frequency":
          data?.travelFrequency === "rarely"
            ? "Rarely"
            : data?.travelFrequency === "monthly"
            ? "Monthly"
            : "Weekly",
      };

      // Combine all parameters
      const requestData = { ...apiData, ...lifestyleParams };

      console.log("Sending data to API:", requestData);

      // Make API request
      const response = await axios.post(
        "http://localhost:5001/api/generate_diet_plan",
        requestData
      );

      console.log("API response:", response.data);

      if (response.data.success) {
        setDietPlanData(response.data);
      } else {
        setError(response.data.error || "Failed to generate diet plan");
      }
    } catch (err) {
      console.error("Error generating diet plan:", err);
      setError(
        "An error occurred while generating your diet plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle updating parameters
  const handleUpdateParameters = () => {
    setDietPlanData(null); // Clear diet plan data to show the form again
  };

  // Create transformed health parameters for saving
  const createTransformedHealthParams = () => {
    return {
      // Health Conditions - Fix case and map to allowed enum values
      diabetes:
        data?.diabetes === "none"
          ? "None"
          : data?.diabetes === "type1"
          ? "Type 1"
          : data?.diabetes === "type2"
          ? "Type 2"
          : "None",

      hypertension: data?.hypertension === "yes" ? "Yes" : "No",

      cardiovascular: data?.cardiovascular === "present" ? "Present" : "Absent",

      digestiveDisorders:
        data?.digestiveDisorders === "none"
          ? "None"
          : data?.digestiveDisorders === "ibs"
          ? "IBS"
          : data?.digestiveDisorders === "celiac"
          ? "Celiac"
          : "None",

      // Food allergies - Pick one from the array or use "None"
      foodAllergies: data?.foodAllergies?.includes("dairy")
        ? "Dairy"
        : data?.foodAllergies?.includes("nuts")
        ? "Nuts"
        : data?.foodAllergies?.includes("shellfish")
        ? "Shellfish"
        : "None",

      // Body metrics - Convert strings to numbers
      height: parseFloat(data?.height || "170"),
      weight: parseFloat(data?.weight || "70"),

      // BMI Category - Use API-specific field with proper capitalization
      bmiCategory: data?.["BMI Category"] || "Normal",

      targetWeight: parseFloat(data?.targetWeight || "70"),

      // Weight Change History - Map to allowed enum values
      weightChangeHistory:
        data?.weightChangeHistory === "stable" ? "Stable" : "Fluctuating",

      // Physical Activity - Convert strings to numbers
      exerciseFrequency: parseInt(data?.exerciseFrequency || "3"),
      exerciseDuration: parseInt(data?.exerciseDuration || "30"),

      // Exercise Type - Map to allowed enum values
      exerciseType:
        data?.exerciseType === "none"
          ? "None"
          : data?.exerciseType === "cardio"
          ? "Cardio"
          : data?.exerciseType === "strength"
          ? "Strength"
          : data?.exerciseType === "mixed"
          ? "Mixed"
          : "None",

      dailyStepsCount: parseInt(data?.dailyStepsCount || "5000"),

      // Physical Job Activity Level - Fix case
      physicalJobActivityLevel:
        data?.physicalJobActivityLevel === "sedentary"
          ? "Sedentary"
          : data?.physicalJobActivityLevel === "moderate"
          ? "Moderate"
          : data?.physicalJobActivityLevel === "active"
          ? "Active"
          : "Sedentary",

      // Lifestyle - Fix case and convert to numbers where needed
      workSchedule:
        data?.workSchedule === "regular"
          ? "Regular"
          : data?.workSchedule === "flexible"
          ? "Flexible"
          : data?.workSchedule === "shift"
          ? "Shift"
          : "Regular",

      sleepDuration: parseFloat(data?.sleepDuration?.split("-")[0]) || 7,

      sleepQuality:
        data?.sleepQuality === "poor"
          ? "Poor"
          : data?.sleepQuality === "fair"
          ? "Fair"
          : data?.sleepQuality === "good"
          ? "Good"
          : "Good",

      stressLevel:
        data?.stressLevel === "low"
          ? "Low"
          : data?.stressLevel === "medium"
          ? "Medium"
          : data?.stressLevel === "high"
          ? "High"
          : "Medium",

      mealTimingRegularity:
        data?.mealTimingRegularity === "regular" ? "Regular" : "Irregular",

      cookingSkills:
        data?.cookingSkills === "basic"
          ? "Basic"
          : data?.cookingSkills === "intermediate"
          ? "Intermediate"
          : data?.cookingSkills === "advanced"
          ? "Advanced"
          : "Intermediate",

      // Convert cooking time to minutes (numeric)
      availableCookingTime:
        data?.availableCookingTime === "less-than-15"
          ? 15
          : data?.availableCookingTime === "15-30"
          ? 30
          : data?.availableCookingTime === "30-60"
          ? 60
          : 30,

      foodBudget:
        data?.foodBudget === "low"
          ? "Low"
          : data?.foodBudget === "medium"
          ? "Medium"
          : data?.foodBudget === "high"
          ? "High"
          : "Medium",

      alcoholConsumption:
        data?.alcoholConsumption === "none"
          ? "None"
          : data?.alcoholConsumption === "occasional"
          ? "Occasional"
          : data?.alcoholConsumption === "regular"
          ? "Regular"
          : "None",

      smokingStatus:
        data?.smokingStatus === "non-smoker"
          ? "Non-smoker"
          : data?.smokingStatus === "former"
          ? "Former"
          : data?.smokingStatus === "smoker"
          ? "Smoker"
          : "Non-smoker",

      waterIntake: parseInt(data?.waterIntake || "8"),

      // Convert eating out frequency to number
      eatingOutFrequency:
        data?.eatingOutFrequency === "0"
          ? 0
          : data?.eatingOutFrequency === "1-2"
          ? 2
          : data?.eatingOutFrequency === "3-5"
          ? 5
          : data?.eatingOutFrequency === "5-7"
          ? 7
          : 2,

      snackingBehavior:
        data?.snackingBehavior === "regular"
          ? "Regular"
          : data?.snackingBehavior === "irregular"
          ? "Irregular"
          : data?.snackingBehavior === "average"
          ? "Average"
          : "Regular",

      // Convert food prep time to numeric value
      foodPreparationTimeAvailability:
        data?.foodPrepTimeAvailability === "weekends-only"
          ? 2
          : data?.foodPrepTimeAvailability === "few-days"
          ? 4
          : data?.foodPrepTimeAvailability === "daily"
          ? 7
          : 4,

      travelFrequency:
        data?.travelFrequency === "rarely"
          ? "Rarely"
          : data?.travelFrequency === "monthly"
          ? "Monthly"
          : data?.travelFrequency === "weekly"
          ? "Weekly"
          : "Rarely",

      // Dietary preferences
      dietType: data?.["Diet Type"] || "Non-spicy",

      mealSizePreference: data?.["Meal Size Preference"] || "Regular 3 meals",

      spiceTolerance:
        data?.spiceTolerance === "low"
          ? "Low"
          : data?.spiceTolerance === "medium"
          ? "Medium"
          : data?.spiceTolerance === "high"
          ? "High"
          : "Medium",

      // Pick one cuisine from the array
      cuisinePreferences: data?.cuisinePreferences?.includes("mediterranean")
        ? "Mediterranean"
        : data?.cuisinePreferences?.includes("asian")
        ? "Asian"
        : data?.cuisinePreferences?.includes("western")
        ? "Western"
        : "Other",

      foodTexturePreferences:
        data?.foodTexturePreferences === "soft"
          ? "Soft"
          : data?.foodTexturePreferences === "crunchy"
          ? "Crunchy"
          : data?.foodTexturePreferences === "mixed"
          ? "Mixed"
          : "Mixed",

      portionControlAbility:
        data?.portionControlAbility === "poor"
          ? "Poor"
          : data?.portionControlAbility === "fair"
          ? "Fair"
          : data?.portionControlAbility === "good"
          ? "Good"
          : "Good",

      previousDietSuccessHistory:
        data?.previousDietSuccessHistory === "yes" ? "Yes" : "No",

      // Pick one intolerance from the array
      foodIntolerances: data?.foodIntolerances?.includes("lactose")
        ? "Lactose"
        : data?.foodIntolerances?.includes("gluten")
        ? "Gluten"
        : "None",

      preferredMealComplexity:
        data?.preferredMealComplexity === "simple"
          ? "Simple"
          : data?.preferredMealComplexity === "moderate"
          ? "Moderate"
          : data?.preferredMealComplexity === "complex"
          ? "Complex"
          : "Moderate",

      seasonalFoodPreferences:
        data?.seasonalFoodPreferences === "yes" ? "Yes" : "No",
    };
  };

  return (
    <div className="space-y-6">
      {!dietPlanData && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Your Diet Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Based on your profile information, we can now generate a
              personalized 7-day diet plan tailored to your health conditions,
              lifestyle, and preferences.
            </p>
            <Button
              onClick={generateDietPlan}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Diet Plan...
                </>
              ) : (
                "Generate My Diet Plan"
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {dietPlanData && (
        <>
          <DietPlanDisplay
            dietPlan={dietPlanData.diet_plan}
            nutritionalAnalysis={dietPlanData.nutritional_analysis}
            userCluster={dietPlanData.user_cluster}
          />
          <DietPlanActions
            dietPlan={dietPlanData.diet_plan}
            nutritionalAnalysis={dietPlanData.nutritional_analysis}
            userCluster={dietPlanData.user_cluster}
            healthParams={createTransformedHealthParams()}
            onUpdateParameters={handleUpdateParameters}
          />
        </>
      )}
    </div>
  );
};

export default GenerateDietPlan;

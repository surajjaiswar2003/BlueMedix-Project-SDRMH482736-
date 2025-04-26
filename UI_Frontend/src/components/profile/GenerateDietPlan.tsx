// components/GenerateDietPlan.tsx
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import DietPlanDisplay from "./DietPlanDisplay";

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
        <DietPlanDisplay
          dietPlan={dietPlanData.diet_plan}
          nutritionalAnalysis={dietPlanData.nutritional_analysis}
          userCluster={dietPlanData.user_cluster}
        />
      )}
    </div>
  );
};

export default GenerateDietPlan;

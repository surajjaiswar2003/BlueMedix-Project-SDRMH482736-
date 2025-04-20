import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HealthConditionsForm from "@/components/profile/HealthConditionsForm";
import BMIForm from "@/components/profile/BMIForm";
import PhysicalActivityForm from "@/components/profile/PhysicalActivityForm";
import LifestyleForm from "@/components/profile/LifestyleForm";
import DietaryPreferencesForm from "@/components/profile/DietaryPreferencesForm";
import DietPlanView from "@/components/profile/DietPlanView";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

// Define all the form steps
const FORM_STEPS = [
  "health",
  "bmi",
  "physical",
  "lifestyle",
  "dietary",
  "review",
];

const Profile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState("");
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
    seasonalFoodPreferences: "",
  });

  // Automatically determine sleep quality based on sleep duration
  const determineSleepQuality = (duration) => {
    if (!duration) return "";

    // Parse the sleep duration value
    let hours = 0;
    if (duration === "less-than-5") hours = 4;
    else if (duration === "5-6") hours = 5.5;
    else if (duration === "6-7") hours = 6.5;
    else if (duration === "7-8") hours = 7.5;
    else if (duration === "8-9") hours = 8.5;
    else if (duration === "more-than-9") hours = 9.5;

    // Determine quality based on hours
    if (hours < 6) return "poor";
    if (hours < 7) return "fair";
    return "good";
  };

  const updateFormData = (newData) => {
    const updatedData = { ...formData, ...newData };

    // If sleep duration is updated, automatically update sleep quality
    if (newData.sleepDuration) {
      updatedData.sleepQuality = determineSleepQuality(newData.sleepDuration);
    }

    setFormData(updatedData);
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

  // Function to generate diet plan - simplified to match your working implementation
  const generateDietPlan = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Prepare parameters similar to your working implementation
      const parameters = {
        // Health conditions
        diabetes: formData.diabetes || "",
        hypertension: formData.hypertension || "No",
        cardiovascular: formData.cardiovascular || "Absent",
        digestive_disorder: formData.digestiveDisorders || "",
        food_allergies: Array.isArray(formData.foodAllergies)
          ? formData.foodAllergies.join(", ")
          : "",

        // BMI related
        height: parseInt(formData.height) || 170,
        weight: parseInt(formData.weight) || 70,
        target_weight:
          parseInt(formData.targetWeight) || parseInt(formData.weight) || 70,
        weight_change_history: formData.weightChangeHistory || "Stable",
        bmi_category: formData.bmiCategory || "Normal",

        // Physical activity
        exercise_frequency: parseInt(formData.exerciseFrequency) || 3,
        exercise_duration: parseInt(formData.exerciseDuration) || 30,
        exercise_type: formData.exerciseType || "Walking",
        daily_steps: formData.dailyStepsCount || "5000",
        physical_job_activity: formData.physicalJobActivityLevel || "Light",

        // Lifestyle
        sleep_duration: formData.sleepDuration || "7-8",
        sleep_quality: formData.sleepQuality || "good",
        stress_level: formData.stressLevel || "Moderate",
        meal_timing_regularity: formData.mealTimingRegularity || "Regular",
        cooking_skills: formData.cookingSkills || "Basic",
        available_cooking_time: formData.availableCookingTime || "30",
        food_budget: formData.foodBudget || "Medium",
        alcohol_consumption: formData.alcoholConsumption || "None",
        smoking_status: formData.smokingStatus || "Non-smoker",
        water_intake: formData.waterIntake || "8",
        eating_out_frequency: formData.eatingOutFrequency || "Rarely",
        snacking_behavior: formData.snackingBehavior || "Moderate",
        food_prep_time: formData.foodPrepTimeAvailability || "30",
        travel_frequency: formData.travelFrequency || "Rarely",

        // Dietary preferences
        diet_type: formData.dietType || "Non-vegetarian",
        meal_size_preference: formData.mealSizePreference || "Regular meals",
        spice_tolerance: formData.spiceTolerance || "Medium",
        cuisine_preferences: Array.isArray(formData.cuisinePreferences)
          ? formData.cuisinePreferences.join(", ")
          : "Mixed",
        food_texture_preferences:
          formData.foodTexturePreferences || "No preference",
        portion_control_ability: formData.portionControlAbility || "Moderate",
        previous_diet_success: formData.previousDietSuccessHistory || "None",
        food_intolerances: Array.isArray(formData.foodIntolerances)
          ? formData.foodIntolerances.join(", ")
          : "",
        preferred_meal_complexity: formData.preferredMealComplexity || "Medium",
        seasonal_food_preferences:
          formData.seasonalFoodPreferences || "No preference",

        // Additional required parameters
        gender: "male",
        age: 35,
        work_schedule: formData.workSchedule || "Regular",
      };

      // Direct axios call like in your working implementation
      const response = await axios.post(
        "http://localhost:5000/api/generate-diet",
        parameters
      );

      // Set the diet plan data
      setDietPlan(response.data.plan);
    } catch (err) {
      console.error("Error generating diet plan:", err);
      setError(
        err.response?.data?.error ||
          "Failed to generate diet plan. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetToForm = () => {
    setDietPlan(null);
    setCurrentStep(0);
    window.scrollTo(0, 0);
  };

  // If diet plan is generated, show the diet plan view
  if (dietPlan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <DietPlanView
              dietPlan={dietPlan}
              onReview={() => navigate("/review-diet-plan")}
              onUpdateParameters={resetToForm}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine which form to show based on current step
  const renderForm = () => {
    switch (FORM_STEPS[currentStep]) {
      case "health":
        return (
          <HealthConditionsForm data={formData} updateData={updateFormData} />
        );
      case "bmi":
        return <BMIForm data={formData} updateData={updateFormData} />;
      case "physical":
        return (
          <PhysicalActivityForm data={formData} updateData={updateFormData} />
        );
      case "lifestyle":
        return <LifestyleForm data={formData} updateData={updateFormData} />;
      case "dietary":
        return (
          <DietaryPreferencesForm data={formData} updateData={updateFormData} />
        );
      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please review all your information before generating your
                personalized diet plan
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Health Conditions */}
              <Card className="overflow-hidden">
                <div className="bg-primary text-primary-foreground p-3">
                  <h3 className="font-medium">Health Conditions</h3>
                </div>
                <CardContent className="p-4">
                  <dl className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Diabetes:
                      </dt>
                      <dd className="text-sm">
                        {formData.diabetes || "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Hypertension:
                      </dt>
                      <dd className="text-sm">
                        {formData.hypertension || "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Cardiovascular:
                      </dt>
                      <dd className="text-sm">
                        {formData.cardiovascular || "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Digestive Disorders:
                      </dt>
                      <dd className="text-sm">
                        {formData.digestiveDisorders || "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Food Allergies:
                      </dt>
                      <dd className="text-sm">
                        {formData.foodAllergies &&
                        formData.foodAllergies.length > 0
                          ? formData.foodAllergies.join(", ")
                          : "None"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Body Metrics */}
              <Card className="overflow-hidden">
                <div className="bg-primary text-primary-foreground p-3">
                  <h3 className="font-medium">Body Metrics</h3>
                </div>
                <CardContent className="p-4">
                  <dl className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Height:
                      </dt>
                      <dd className="text-sm">
                        {formData.height
                          ? `${formData.height} cm`
                          : "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Weight:
                      </dt>
                      <dd className="text-sm">
                        {formData.weight
                          ? `${formData.weight} kg`
                          : "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        BMI Category:
                      </dt>
                      <dd className="text-sm">
                        {formData.bmiCategory || "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Target Weight:
                      </dt>
                      <dd className="text-sm">
                        {formData.targetWeight
                          ? `${formData.targetWeight} kg`
                          : "Not specified"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Physical Activity */}
              <Card className="overflow-hidden">
                <div className="bg-primary text-primary-foreground p-3">
                  <h3 className="font-medium">Physical Activity</h3>
                </div>
                <CardContent className="p-4">
                  <dl className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Exercise Frequency:
                      </dt>
                      <dd className="text-sm">
                        {formData.exerciseFrequency || "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Exercise Duration:
                      </dt>
                      <dd className="text-sm">
                        {formData.exerciseDuration || "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Exercise Type:
                      </dt>
                      <dd className="text-sm">
                        {formData.exerciseType || "Not specified"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Dietary Preferences */}
              <Card className="overflow-hidden">
                <div className="bg-primary text-primary-foreground p-3">
                  <h3 className="font-medium">Dietary Preferences</h3>
                </div>
                <CardContent className="p-4">
                  <dl className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Diet Type:
                      </dt>
                      <dd className="text-sm">
                        {formData.dietType || "Not specified"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Cuisine Preferences:
                      </dt>
                      <dd className="text-sm">
                        {formData.cuisinePreferences &&
                        formData.cuisinePreferences.length > 0
                          ? formData.cuisinePreferences.join(", ")
                          : "None"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Food Intolerances:
                      </dt>
                      <dd className="text-sm">
                        {formData.foodIntolerances &&
                        formData.foodIntolerances.length > 0
                          ? formData.foodIntolerances.join(", ")
                          : "None"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
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
                Step {currentStep + 1} of {FORM_STEPS.length}:{" "}
                {FORM_STEPS[currentStep].charAt(0).toUpperCase() +
                  FORM_STEPS[currentStep].slice(1)}
              </CardDescription>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%`,
                  }}
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
                    <Button
                      type="button"
                      onClick={generateDietPlan}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Generating Diet Plan...
                        </>
                      ) : (
                        "Generate Diet Plan"
                      )}
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

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

interface ReviewHealthParametersProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onSave: () => Promise<void>;
  onBack: () => void;
}

const ReviewHealthParameters: React.FC<ReviewHealthParametersProps> = ({
  data,
  updateData,
  onSave,
  onBack,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave();
    } catch (err) {
      setError("Failed to save parameters. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Health Conditions Section */}
            <div>
              <h3 className="text-lg font-medium mb-2 border-b pb-1">
                Health Conditions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Diabetes
                  </p>
                  <p className="capitalize">{data.diabetes}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Hypertension
                  </p>
                  <p className="capitalize">{data.hypertension}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cardiovascular
                  </p>
                  <p className="capitalize">{data.cardiovascular}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Digestive Disorders
                  </p>
                  <p className="capitalize">{data.digestiveDisorders}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Food Allergies
                  </p>
                  <p>
                    {data.foodAllergies.length > 0
                      ? data.foodAllergies.join(", ")
                      : "None"}
                  </p>
                </div>
              </div>
            </div>

            {/* Lifestyle Section */}
            <div>
              <h3 className="text-lg font-medium mb-2 border-b pb-1">
                Lifestyle
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Work Schedule
                  </p>
                  <p className="capitalize">{data.workSchedule}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sleep Duration
                  </p>
                  <p>{data.sleepDuration} hours</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sleep Quality
                  </p>
                  <p className="capitalize">{data.sleepQuality}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Stress Level
                  </p>
                  <p className="capitalize">{data.stressLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cooking Skills
                  </p>
                  <p className="capitalize">{data.cookingSkills}</p>
                </div>
              </div>
            </div>

            {/* Physical Activity Section */}
            <div>
              <h3 className="text-lg font-medium mb-2 border-b pb-1">
                Physical Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Exercise Frequency
                  </p>
                  <p>{data.exerciseFrequency} days/week</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Exercise Duration
                  </p>
                  <p>{data.exerciseDuration} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Exercise Type
                  </p>
                  <p className="capitalize">{data.exerciseType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Daily Steps
                  </p>
                  <p>{data.dailyStepsCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Physical Job Activity
                  </p>
                  <p className="capitalize">{data.physicalJobActivityLevel}</p>
                </div>
              </div>
            </div>

            {/* Dietary Preferences Section */}
            <div>
              <h3 className="text-lg font-medium mb-2 border-b pb-1">
                Dietary Preferences
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Diet Type
                  </p>
                  <p className="capitalize">{data.dietType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Meal Size Preference
                  </p>
                  <p className="capitalize">{data.mealSizePreference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Spice Tolerance
                  </p>
                  <p className="capitalize">{data.spiceTolerance}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cuisine Preferences
                  </p>
                  <p>{data.cuisinePreferences.join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Food Intolerances
                  </p>
                  <p>
                    {data.foodIntolerances.length > 0
                      ? data.foodIntolerances.join(", ")
                      : "None"}
                  </p>
                </div>
              </div>
            </div>

            {/* BMI Section */}
            <div>
              <h3 className="text-lg font-medium mb-2 border-b pb-1">
                Body Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Height
                  </p>
                  <p>{data.height} cm</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Weight
                  </p>
                  <p>{data.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    BMI Category
                  </p>
                  <p>{data.bmiCategory}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Target Weight
                  </p>
                  <p>{data.targetWeight} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Weight Change History
                  </p>
                  <p className="capitalize">{data.weightChangeHistory}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Parameters"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewHealthParameters;

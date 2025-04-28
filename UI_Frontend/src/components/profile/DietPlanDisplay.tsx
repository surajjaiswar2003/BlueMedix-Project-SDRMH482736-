// components/DietPlanDisplay.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  fiber: number;
}

interface DayPlan {
  [mealType: string]: Meal | string;
}

interface DietPlan {
  [day: string]: DayPlan;
}

interface NutritionalAnalysis {
  avg_nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sodium: number;
    fiber: number;
  };
  macro_percentages: {
    protein_pct: number;
    carbs_pct: number;
    fat_pct: number;
  };
  variety_metrics: {
    unique_recipes: number;
    total_meals: number;
    variety_score: number;
  };
  meal_coverage: number;
}

interface DietPlanDisplayProps {
  dietPlan: DietPlan;
  nutritionalAnalysis: NutritionalAnalysis;
  userCluster: number;
}

const DietPlanDisplay: React.FC<DietPlanDisplayProps> = ({
  dietPlan,
  nutritionalAnalysis,
  userCluster,
}) => {
  const days = Object.keys(dietPlan);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Your 7-Day Diet Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Daily Calories</p>
              <p className="text-2xl font-bold">
                {nutritionalAnalysis.avg_nutrition.calories.toFixed(0)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Protein</p>
              <p className="text-2xl font-bold">
                {nutritionalAnalysis.macro_percentages.protein_pct.toFixed(1)}%
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Carbs</p>
              <p className="text-2xl font-bold">
                {nutritionalAnalysis.macro_percentages.carbs_pct.toFixed(1)}%
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Fat</p>
              <p className="text-2xl font-bold">
                {nutritionalAnalysis.macro_percentages.fat_pct.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Macronutrient Distribution
            </p>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{
                  width: `${nutritionalAnalysis.macro_percentages.protein_pct}%`,
                }}
              />
              <div
                className="bg-yellow-500 h-full"
                style={{
                  width: `${nutritionalAnalysis.macro_percentages.carbs_pct}%`,
                }}
              />
              <div
                className="bg-red-500 h-full"
                style={{
                  width: `${nutritionalAnalysis.macro_percentages.fat_pct}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Protein</span>
              <span>Carbs</span>
              <span>Fat</span>
            </div>
          </div>

          <Tabs defaultValue={days[0]}>
            <TabsList className="grid grid-cols-7">
              {days.map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day} value={day} className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{day} Meal Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(dietPlan[day])
                        .filter(
                          ([mealType]) =>
                            !["day_number", "day_label"].includes(mealType)
                        )
                        .map(([mealType, meal]) =>
                          meal && typeof meal !== "string" ? (
                            <div
                              key={mealType}
                              className="border-b pb-4 last:border-0"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{mealType}</h4>
                                  <p className="font-medium mt-1">
                                    {meal.name}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="outline">
                                      {meal.calories.toFixed(0)} calories
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50"
                                    >
                                      {meal.protein.toFixed(0)}g protein
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-yellow-50"
                                    >
                                      {meal.carbs.toFixed(0)}g carbs
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-red-50"
                                    >
                                      {meal.fat.toFixed(0)}g fat
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null
                        )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Nutritional Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Daily Averages</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Calories</span>
                    <span>
                      {nutritionalAnalysis.avg_nutrition.calories.toFixed(0)}{" "}
                      kcal
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (nutritionalAnalysis.avg_nutrition.calories / 2500) * 100
                    )}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Protein</span>
                    <span>
                      {nutritionalAnalysis.avg_nutrition.protein.toFixed(0)}g
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (nutritionalAnalysis.avg_nutrition.protein / 100) * 100
                    )}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Carbs</span>
                    <span>
                      {nutritionalAnalysis.avg_nutrition.carbs.toFixed(0)}g
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (nutritionalAnalysis.avg_nutrition.carbs / 300) * 100
                    )}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Fat</span>
                    <span>
                      {nutritionalAnalysis.avg_nutrition.fat.toFixed(0)}g
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (nutritionalAnalysis.avg_nutrition.fat / 80) * 100
                    )}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Plan Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Recipe Variety
                  </p>
                  <p className="text-2xl font-bold">
                    {nutritionalAnalysis.variety_metrics.variety_score.toFixed(
                      0
                    )}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {nutritionalAnalysis.variety_metrics.unique_recipes} unique
                    recipes out of{" "}
                    {nutritionalAnalysis.variety_metrics.total_meals} meals
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meal Coverage</p>
                  <p className="text-2xl font-bold">
                    {nutritionalAnalysis.meal_coverage.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Percentage of meals with suitable recipes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Health Profile Cluster
                  </p>
                  <p className="text-2xl font-bold">Cluster {userCluster}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietPlanDisplay;

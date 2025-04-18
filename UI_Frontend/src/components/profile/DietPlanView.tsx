import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DietPlanViewProps {
  dietPlan: any;
  onReview: () => void;
  onUpdateParameters: () => void;
}

const DietPlanView: React.FC<DietPlanViewProps> = ({
  dietPlan,
  onReview,
  onUpdateParameters,
}) => {
  // Function to format macronutrient values
  const formatMacro = (value: number) => {
    return Math.round(value);
  };

  // Function to format percentage values
  const formatPercent = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Your Personalized 7-Day Diet Plan
        </h1>
        <p className="text-muted-foreground">
          Based on your health profile, we've created a customized meal plan to
          help you reach your goals.
        </p>
      </div>

      {/* Overall Stats Card */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-center">
            Weekly Nutrition Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-muted-foreground text-sm">
                Avg. Daily Calories
              </p>
              <p className="text-2xl font-bold">
                {dietPlan.overall_stats.avg_daily_calories} kcal
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-muted-foreground text-sm">Protein</p>
              <p className="text-2xl font-bold">
                {formatMacro(dietPlan.overall_stats.avg_daily_proteins)}g
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPercent(dietPlan.overall_stats.overall_protein_percent)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-muted-foreground text-sm">Carbs</p>
              <p className="text-2xl font-bold">
                {formatMacro(dietPlan.overall_stats.avg_daily_carbs)}g
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPercent(dietPlan.overall_stats.overall_carb_percent)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-muted-foreground text-sm">Fats</p>
              <p className="text-2xl font-bold">
                {formatMacro(dietPlan.overall_stats.avg_daily_fats)}g
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPercent(dietPlan.overall_stats.overall_fat_percent)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Meal Plans */}
      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid grid-cols-7 mb-4">
          {dietPlan.days.map((day, index) => (
            <TabsTrigger key={index} value={`day${index + 1}`}>
              Day {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {dietPlan.days.map((day, dayIndex) => (
          <TabsContent
            key={dayIndex}
            value={`day${dayIndex + 1}`}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Day {day.day} Meal Plan</h2>
              <div className="flex space-x-4 text-sm">
                <div>
                  <span className="font-medium">Calories:</span>{" "}
                  {formatMacro(day.daily_totals.calories)} kcal
                </div>
                <div>
                  <span className="font-medium">Protein:</span>{" "}
                  {formatMacro(day.daily_totals.proteins)}g (
                  {formatPercent(day.daily_totals.protein_percent)}%)
                </div>
                <div>
                  <span className="font-medium">Carbs:</span>{" "}
                  {formatMacro(day.daily_totals.carbs)}g (
                  {formatPercent(day.daily_totals.carb_percent)}%)
                </div>
                <div>
                  <span className="font-medium">Fats:</span>{" "}
                  {formatMacro(day.daily_totals.fats)}g (
                  {formatPercent(day.daily_totals.fat_percent)}%)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {day.meals.map((meal, mealIndex) => (
                <Card key={mealIndex} className="overflow-hidden">
                  <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
                    <h3 className="font-medium capitalize">
                      {meal.meal_type.replace("_", " ")}
                    </h3>
                    <span className="text-xs">{meal.timing}</span>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-lg mb-2">
                      {meal.recipe_name}
                    </h4>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          Calories
                        </p>
                        <p className="font-medium">
                          {formatMacro(meal.calories)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Protein</p>
                        <p className="font-medium">
                          {formatMacro(meal.proteins)}g
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Carbs</p>
                        <p className="font-medium">
                          {formatMacro(meal.carbs)}g
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Fats</p>
                        <p className="font-medium">{formatMacro(meal.fats)}g</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <details className="text-sm">
                        <summary className="font-medium cursor-pointer">
                          Ingredients
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                          {meal.ingredients}
                        </p>
                      </details>

                      <details className="text-sm">
                        <summary className="font-medium cursor-pointer">
                          Instructions
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                          {meal.instructions}
                        </p>
                      </details>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-4">
        <Button variant="outline" onClick={onReview}>
          Diet Plan for Review
        </Button>
        <Button onClick={onUpdateParameters}>Update Parameters</Button>
      </div>
    </div>
  );
};

export default DietPlanView;

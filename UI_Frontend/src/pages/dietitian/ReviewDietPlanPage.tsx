import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ReviewDietPlanPage: React.FC = () => {
  const { dietPlanId } = useParams<{ dietPlanId: string }>();
  const navigate = useNavigate();

  const [dietPlan, setDietPlan] = useState<any>(null);
  const [healthParams, setHealthParams] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingMeal, setUpdatingMeal] = useState<{
    dayNumber: number;
    mealType: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const planRes = await axios.get(
          `http://localhost:5000/api/diet-plans/${dietPlanId}`
        );
        setDietPlan(planRes.data);

        const userId = planRes.data.userId._id;
        const healthRes = await axios.get(
          `http://localhost:5000/api/health-parameters/${userId}`
        );
        setHealthParams(healthRes.data);

        const recipesRes = await axios.get(`http://localhost:5000/api/recipes`);
        setRecipes(recipesRes.data);
      } catch (err) {
        toast.error("Failed to load data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dietPlanId]);

  const handleUpdateMeal = async (
    dayNumber: number,
    mealType: string,
    recipeId: string
  ) => {
    try {
      await axios.put(
        `http://localhost:5000/api/diet-plans/${dietPlanId}/meal`,
        { dayNumber, mealType, recipeId }
      );
      toast.success("Meal updated!");
      setUpdatingMeal(null);
      const planRes = await axios.get(
        `http://localhost:5000/api/diet-plans/${dietPlanId}`
      );
      setDietPlan(planRes.data);
    } catch (err) {
      toast.error("Failed to update meal.");
      console.error(err);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/diet-plans/${dietPlanId}/approve`
      );
      toast.success("Diet plan approved!");
      navigate("/dietitian/dashboard");
    } catch (err) {
      toast.error("Failed to approve plan.");
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!dietPlan || !healthParams) return <div>Not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-2">
        Review Diet Plan for {dietPlan.userId.firstName}{" "}
        {dietPlan.userId.lastName}
      </h1>

      {/* Health Parameters */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Health Parameters</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Diabetes:</strong> {healthParams.diabetes}
          </div>
          <div>
            <strong>Hypertension:</strong> {healthParams.hypertension}
          </div>
          <div>
            <strong>Cardiovascular:</strong> {healthParams.cardiovascular}
          </div>
          <div>
            <strong>Height:</strong> {healthParams.height} cm
          </div>
          <div>
            <strong>Weight:</strong> {healthParams.weight} kg
          </div>
          <div>
            <strong>BMI Category:</strong> {healthParams.bmiCategory}
          </div>
          <div>
            <strong>Target Weight:</strong> {healthParams.targetWeight} kg
          </div>
          <div>
            <strong>Exercise Freq:</strong> {healthParams.exerciseFrequency}{" "}
            days/week
          </div>
          <div>
            <strong>Diet Type:</strong> {healthParams.dietType}
          </div>
        </div>
      </Card>

      {/* Diet Plan Days */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">Diet Plan</h2>
        {dietPlan.days.map((day: any) => (
          <div key={day.day_number} className="mb-6">
            <h3 className="font-semibold mb-2">
              {day.day_label} (Day {day.day_number})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(day)
                .filter(
                  ([mealType]) =>
                    !["day_number", "day_label"].includes(mealType)
                )
                .map(
                  ([mealType, meal]: [string, any]) =>
                    meal && (
                      <div
                        key={mealType}
                        className="border p-4 rounded-md bg-gray-50"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <strong>{mealType}:</strong> {meal.name}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setUpdatingMeal({
                                dayNumber: day.day_number,
                                mealType,
                              })
                            }
                          >
                            Update
                          </Button>
                        </div>
                        <div className="text-xs mt-2">
                          <div>Calories: {meal.calories} kcal</div>
                          <div>Protein: {meal.protein}g</div>
                          <div>Carbs: {meal.carbs}g</div>
                          <div>Fat: {meal.fat}g</div>
                          <div>Ingredients: {meal.ingredients?.join(", ")}</div>
                        </div>
                        {/* Update Modal */}
                        {updatingMeal &&
                          updatingMeal.dayNumber === day.day_number &&
                          updatingMeal.mealType === mealType && (
                            <div className="mt-4 bg-white border p-4 rounded shadow">
                              <h4 className="font-medium mb-2">
                                Select New Recipe
                              </h4>
                              <select
                                className="w-full border rounded p-2 mb-2"
                                onChange={(e) =>
                                  handleUpdateMeal(
                                    day.day_number,
                                    mealType,
                                    e.target.value
                                  )
                                }
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Choose recipe
                                </option>
                                {recipes.map((recipe) => (
                                  <option key={recipe._id} value={recipe._id}>
                                    {recipe.name}
                                  </option>
                                ))}
                              </select>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setUpdatingMeal(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                      </div>
                    )
                )}
            </div>
          </div>
        ))}
      </Card>

      {/* Approve Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleApprove}>
          Approve Diet Plan
        </Button>
      </div>
    </div>
  );
};

export default ReviewDietPlanPage;

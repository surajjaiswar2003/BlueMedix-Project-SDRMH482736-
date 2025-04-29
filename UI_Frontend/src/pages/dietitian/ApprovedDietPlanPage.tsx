import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import axios from "axios";

const ApprovedDietPlanPage = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<any>(null);
  const [healthParams, setHealthParams] = useState<any>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/diet-plans/${id}`
        );
        setPlan(res.data);

        // Fetch health parameters for the user
        const paramsRes = await axios.get(
          `http://localhost:5000/api/health-parameters/${res.data.userId._id}`
        );
        setHealthParams(paramsRes.data);
      } catch (err) {
        setPlan(null);
        setHealthParams(null);
      }
    };
    fetchPlan();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 mt-16 space-y-8">
        <h1 className="text-2xl font-bold mb-4">
          {plan?.userId?.firstName} {plan?.userId?.lastName}'s Approved Diet
          Plan
        </h1>
        {healthParams && (
          <Card className="mb-6 p-4">
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
        )}
        {plan && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Diet Plan</h2>
            {plan.days.map((day: any) => (
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
                            <div>
                              <strong>{mealType}:</strong> {meal.name}
                            </div>
                            <div className="text-xs mt-2">
                              <div>Calories: {meal.calories} kcal</div>
                              <div>Protein: {meal.protein}g</div>
                              <div>Carbs: {meal.carbs}g</div>
                              <div>Fat: {meal.fat}g</div>
                              <div>
                                Ingredients: {meal.ingredients?.join(", ")}
                              </div>
                            </div>
                          </div>
                        )
                    )}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
};

export default ApprovedDietPlanPage;

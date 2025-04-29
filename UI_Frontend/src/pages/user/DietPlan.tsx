import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import DietPlanDisplay from "@/components/profile/DietPlanDisplay";
import axios from "axios";

const DietPlanPage = () => {
  const [dietPlan, setDietPlan] = useState<any | null>(null);
  const [nutritionalAnalysis, setNutritionalAnalysis] = useState<any | null>(
    null
  );
  const [userCluster, setUserCluster] = useState<number | null>(null);
  const [status, setStatus] = useState<"review" | "approved" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const { _id } = JSON.parse(user);
      const fetchPlan = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/diet-plans/current/${_id}`
          );
          if (res.data.dietPlan) {
            setDietPlan(res.data.dietPlan.days);
            setNutritionalAnalysis({
              avg_nutrition: res.data.dietPlan.plan_totals,
              macro_percentages: res.data.dietPlan.macro_percentages,
              variety_metrics: res.data.dietPlan.variety_metrics,
              meal_coverage: res.data.dietPlan.meal_coverage,
            });
            setUserCluster(res.data.dietPlan.user_cluster);
            setStatus(res.data.dietPlan.status);
          }
        } catch (err) {
          setDietPlan(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlan();
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 mt-16">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Your Diet Plan{" "}
              {status && (
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                    status === "review"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {status === "review" ? "Under Review" : "Approved"}
                </span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        {isLoading ? (
          <div>Loading...</div>
        ) : dietPlan && nutritionalAnalysis && userCluster !== null ? (
          <DietPlanDisplay
            dietPlan={dietPlan}
            nutritionalAnalysis={nutritionalAnalysis}
            userCluster={userCluster}
          />
        ) : (
          <div>No diet plan found.</div>
        )}
      </div>
    </>
  );
};

export default DietPlanPage;

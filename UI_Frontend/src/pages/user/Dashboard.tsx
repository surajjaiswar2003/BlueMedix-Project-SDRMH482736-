import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import MultiStepProfileForm from "@/components/profile/MultiStepProfileForm";
import { Utensils, Calendar, Smile } from "lucide-react";
import axios from "axios";
import ChatWidget from "@/components/ChatWidget";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface HealthParams {
  diabetes?: string;
  hypertension?: string;
  cardiovascular?: string;
  digestiveDisorders?: string;
  height?: number;
  weight?: number;
  bmiCategory?: string;
  dietType?: string;
  exerciseFrequency?: number;
  [key: string]: any;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [healthParams, setHealthParams] = useState<HealthParams | null>(null);
  const [loadingHealthParams, setLoadingHealthParams] = useState<boolean>(true);
  const [showMultiStepForm, setShowMultiStepForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [dietPlan, setDietPlan] = useState<any | null>(null);
  const [dietPlanStatus, setDietPlanStatus] = useState<
    "review" | "approved" | null
  >(null);

  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [todayLog, setTodayLog] = useState<any | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);

      // Fetch health parameters
      const fetchHealthParams = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/health-parameters/${parsedUser._id}`
          );
          setHealthParams(response.data);
        } catch (error) {
          setHealthParams(null);
        } finally {
          setLoadingHealthParams(false);
        }
      };

      fetchHealthParams();

      // Fetch current diet plan and status
      const fetchCurrentDietPlan = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/diet-plans/current/${parsedUser._id}`
          );
          if (res.data.dietPlan) {
            setDietPlan(res.data.dietPlan);
            setDietPlanStatus(res.data.dietPlan.status);
            // For today's meals
            if (res.data.dietPlan.days && res.data.dietPlan.days.length > 0) {
              const today = new Date();
              const weekday = today.toLocaleDateString("en-US", {
                weekday: "long",
              });
              const todayDay =
                res.data.dietPlan.days.find(
                  (d: any) => d.day_label === weekday
                ) || res.data.dietPlan.days[(today.getDay() + 6) % 7];
              if (todayDay) {
                const meals = Object.entries(todayDay)
                  .filter(
                    ([key, value]) =>
                      !["day_number", "day_label"].includes(key) &&
                      value &&
                      typeof value === "object"
                  )
                  .map(([mealType, meal]) => ({
                    mealType,
                    ...(typeof meal === 'object' && meal !== null ? meal : {}),
                  }));
                setTodayMeals(meals);
              }
            }
          } else {
            setDietPlan(null);
            setDietPlanStatus(null);
            setTodayMeals([]);
          }
        } catch (error) {
          setDietPlan(null);
          setDietPlanStatus(null);
          setTodayMeals([]);
        }
      };

      // Fetch today's health log
      const fetchTodayLog = async () => {
        try {
          const logRes = await axios.get(
            `http://localhost:5000/api/health-logs/${parsedUser._id}`
          );
          if (logRes.data.logs && logRes.data.logs.length > 0) {
            const today = new Date();
            const todayLog = logRes.data.logs.find((log: any) => {
              const logDate = new Date(log.date);
              return (
                logDate.getFullYear() === today.getFullYear() &&
                logDate.getMonth() === today.getMonth() &&
                logDate.getDate() === today.getDate()
              );
            });
            setTodayLog(todayLog || null);
          }
        } catch (error) {
          setTodayLog(null);
        }
      };

      fetchCurrentDietPlan();
      fetchTodayLog();
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUpdateHealthParams = () => {
    setShowMultiStepForm(true);
  };

  const handleFormComplete = () => {
    setShowMultiStepForm(false);
    if (userData && userData._id) {
      fetchHealthParams(userData._id);
    }
  };

  const fetchHealthParams = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/health-parameters/${userId}`
      );
      setHealthParams(response.data);
    } catch (error) {
      setHealthParams(null);
    } finally {
      setLoadingHealthParams(false);
    }
  };

  const handleGenerateDietPlan = () => {
    navigate("/user/generate-diet-plan");
  };

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6 relative">
        {/* Health Profile Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              {loadingHealthParams
                ? "Loading..."
                : showMultiStepForm
                ? "Update Health Profile"
                : healthParams
                ? "Your Health Profile"
                : "Complete Your Health Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHealthParams ? (
              <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
            ) : showMultiStepForm ? (
              <MultiStepProfileForm onComplete={handleFormComplete} />
            ) : healthParams ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Height
                    </p>
                    <p className="text-lg">{healthParams.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Weight
                    </p>
                    <p className="text-lg">{healthParams.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      BMI Category
                    </p>
                    <p className="text-lg">{healthParams.bmiCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Diet Type
                    </p>
                    <p className="text-lg">{healthParams.dietType}</p>
                  </div>
                  {healthParams.diabetes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Diabetes
                      </p>
                      <p className="text-lg">{healthParams.diabetes}</p>
                    </div>
                  )}
                  {healthParams.exerciseFrequency && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Exercise Frequency
                      </p>
                      <p className="text-lg">
                        {healthParams.exerciseFrequency} days/week
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleUpdateHealthParams}
                >
                  Update Health Parameters
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">
                  You haven't completed your health profile yet. Complete it to
                  get personalized diet plans.
                </p>
                <Button
                  onClick={handleUpdateHealthParams}
                  className="w-full md:w-auto"
                >
                  Complete Health Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diet Plan Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Your Diet Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHealthParams ? (
              <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
            ) : !healthParams ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">
                    Complete Your Health Profile First
                  </h3>
                  <p className="text-sm text-gray-500">
                    You need to complete your health profile before generating a
                    diet plan.
                  </p>
                </div>
              </div>
            ) : !dietPlan ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">No Diet Plan Found</h3>
                  <p className="text-sm text-gray-500">
                    Generate a personalized diet plan to get started.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={handleGenerateDietPlan}
                >
                  Generate Diet Plan
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-lg">
                      Personalized Diet Plan
                    </h3>
                    <p className="text-sm text-gray-500">
                      {dietPlanStatus === "review"
                        ? "Your diet plan is currently under review by a dietitian."
                        : "Your diet plan has been approved and is ready to follow."}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      dietPlanStatus === "review"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {dietPlanStatus === "review" ? "Under Review" : "Approved"}
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-full md:w-auto"
                  onClick={() => navigate("/user/diet-plan")}
                >
                  View Diet Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personalized Today Overview */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Today's Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Today's Meals */}
              <div>
                <h3 className="font-semibold mb-2">Today's Meals</h3>
                {todayMeals.length === 0 ? (
                  <div className="text-gray-500 text-sm">
                    No meals scheduled for today.{" "}
                    <Button
                      size="sm"
                      variant="link"
                      onClick={handleGenerateDietPlan}
                    >
                      Generate/View Diet Plan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todayMeals.map((meal, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                            <Utensils className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-medium">{meal.mealType}</span>
                            <span className="ml-2">{meal.name}</span>
                            <div className="text-xs text-gray-500">
                              {meal.calories} cal
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Today's Health Log */}
              <div>
                <h3 className="font-semibold mb-2">Today's Health Log</h3>
                {todayLog ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Water:</span>{" "}
                      {todayLog.water?.glasses || "-"} glasses
                    </div>
                    <div>
                      <span className="text-sm font-medium">Sleep:</span>{" "}
                      {todayLog.sleep?.hours || "-"} hours
                    </div>
                    <div>
                      <span className="text-sm font-medium">Exercise:</span>{" "}
                      {todayLog.exercise?.minutes || "-"} min (
                      {todayLog.exercise?.type || "-"})
                    </div>
                    <div>
                      <span className="text-sm font-medium">Mood:</span>{" "}
                      {todayLog.mood?.rating || "-"}
                    </div>
                    <div>
                      <span className="text-sm font-medium">Stress:</span>{" "}
                      {todayLog.stress?.level || "-"}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    No health log for today yet.{" "}
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => navigate("/user/track")}
                    >
                      Log Now
                    </Button>
                  </div>
                )}
              </div>
              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/user/track")}
                >
                  <Smile className="h-4 w-4 mr-2" />
                  Log Today's Health
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/user/diet-plan")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Diet Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ChatWidget />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
